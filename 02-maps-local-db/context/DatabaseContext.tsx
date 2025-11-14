import ErrorView from "@/components/view/ErrorView";
import { Database, initializeDatabase } from "@/database/init";
import { mapMarkerImages, mapMarkers } from "@/database/schema";
import { MapMarkerImageList, MapMarkerImageModel, MapMarkerList, MapMarkerModel } from "@/types";
import { eq } from "drizzle-orm";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LatLng } from "react-native-maps";

type MapMarker$Insertion = typeof mapMarkers.$inferInsert;
type MapMarkerImage$Insertion = typeof mapMarkerImages.$inferInsert;

interface DatabaseContext {
    // --- map markers CRUD
    createMarker: (location: LatLng) => Promise<MapMarkerModel>;
    deleteMarker: (id: number) => Promise<boolean>;
    queryMarkers: () => Promise<MapMarkerList>;
    updateMarker: (id: number, title: string | null, description: string | null) => Promise<boolean>;
    
    // --- map marker images CRUD
    createMarkerImage: (markerId: number, url: string) => Promise<MapMarkerImageModel>
    deleteMarkerImage: (id: number) => Promise<boolean>;
    queryMarkerImages: (markerId: number) => Promise<MapMarkerImageList>;
    
    // --- database state
    state: DatabaseState;
}

interface DatabaseState {
    isLoading: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContext | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [database, setDatabase] = useState<Database | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        initializeDatabase()
            .then(setDatabase)
            .catch(setError)
            .finally(() => setLoading(false));
        
        return () => {
            // Expo SQLite: nothing to do here :)
            // Connection will be closed automatically when the app is shut down
        };
    }, []);
    
    if (!database)
        return <ErrorView text='Произошла ошибка при инициализации приложения :(' />;

    const state: DatabaseState = { isLoading: isLoading, error: error }
    const context = constructContext(database, state);

    return (
        <DatabaseContext.Provider value={context}>
            {children}
        </DatabaseContext.Provider>
    );
};

export function useDatabase() {
    const context = useContext(DatabaseContext);
    if (context)
        return context

    throw new Error("No DatabaseContext provided!")
}

function constructContext(database: Database, state: DatabaseState) {
    
    // -------------- MAP MARKERS CRUD ---------------------------------------------------------------------------------
    
    const createMarker = useCallback(async (location: LatLng) => {
        const values: MapMarker$Insertion = { location: location };
        const models = await database.insert(mapMarkers).values(values).returning();
        return models[0] as MapMarkerModel;
    }, [database]);
    
    const deleteMarker = useCallback(async (id: number) => {
        const result = await database.delete(mapMarkers).where(eq(mapMarkers.id, id)).limit(1);
        return result.changes > 0;
    }, [database]);
    
    const queryMarkers = useCallback(async () => {
        const models = await database.select().from(mapMarkers);
        return models as MapMarkerList;
    }, [database]);
    
    const updateMarker = useCallback(async (id: number, title: string | null, description: string | null) => {
        const values: MapMarker$Insertion = { title: title, description: description };
        const result = await database.update(mapMarkers).set(values).where(eq(mapMarkers.id, id)).limit(1);
        return result.changes > 0;
    }, [database]);
    
    // -------------- MAP MARKER IMAGES CRUD ---------------------------------------------------------------------------
    
    const createMarkerImage = useCallback(async (markerId: number, url: string) => {
        const values: MapMarkerImage$Insertion = { markerId: markerId, url: url }
        const models = await database.insert(mapMarkerImages).values(values).returning();
        return models[0]
    }, [database]);
    
    const deleteMarkerImage = useCallback(async (id: number) => {
        const result = await database.delete(mapMarkerImages).where(eq(mapMarkerImages.id, id)).limit(1)
        return result.changes > 0
    }, [database]);
    
    const queryMarkerImages = useCallback(async (markerId: number) => {
        return await database.select().from(mapMarkerImages).where(eq(mapMarkerImages.markerId, markerId))
    }, [database]);
    
    // -------------- DATABASE CONTEXT ---------------------------------------------------------------------------------

    return useMemo(() => ({
        createMarker,
        deleteMarker,
        queryMarkers,
        updateMarker,
        createMarkerImage,
        deleteMarkerImage,
        queryMarkerImages,
        state,
    }), [database]);

}