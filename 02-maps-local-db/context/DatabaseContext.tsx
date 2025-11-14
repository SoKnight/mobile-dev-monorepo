import ErrorView from "@/components/view/ErrorView";
import LoadingView from "@/components/view/LoadingView";
import { Database, initializeDatabase } from "@/database/init";
import { constructOperations } from "@/database/operations";
import { MapMarkerImageList, MapMarkerImageModel, MapMarkerList, MapMarkerModel } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LatLng } from "react-native-maps";

interface DatabaseContext {
    // --- map markers CRUD
    createMarker: (location: LatLng) => Promise<MapMarkerModel>;
    deleteMarker: (id: number) => Promise<boolean>;
    queryMarkerById: (id: number) => Promise<MapMarkerModel | null>;
    queryMarkers: () => Promise<MapMarkerList>;
    updateMarker: (id: number, title: string | null, description: string | null) => Promise<boolean>;
    
    // --- map marker images CRUD
    createMarkerImage: (markerId: number, url: string) => Promise<MapMarkerImageModel>
    deleteMarkerImage: (id: number) => Promise<boolean>;
    queryMarkerImages: (markerId: number) => Promise<MapMarkerImageList>;
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

    if (isLoading)
        return <LoadingView />

    if (error)
        return <ErrorView text={error.message} />

    if (!database)
        return <ErrorView text='Произошла ошибка при инициализации приложения :(' />

    const context: DatabaseContext = useMemo(() => constructOperations(database), [database])

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