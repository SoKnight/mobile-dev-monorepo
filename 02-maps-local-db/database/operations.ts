import { MapMarkerList, MapMarkerModel } from "@/types";
import { eq } from "drizzle-orm";
import { LatLng } from "react-native-maps";
import { Database } from "./init";
import { mapMarkerImages, mapMarkers } from "./schema";

type MapMarker$Insertion = typeof mapMarkers.$inferInsert;
type MapMarkerImage$Insertion = typeof mapMarkerImages.$inferInsert;

export const constructOperations = (database: Database | null) => ({
    // -------------- MAP MARKERS CRUD ---------------------------------------------------------------------------------

    createMarker: async (location: LatLng) => {
        const values: MapMarker$Insertion = { location: location };
        const models = await require(database).insert(mapMarkers).values(values).returning();
        return models[0] as MapMarkerModel;
    },
    
    deleteMarker: async (id: number) => {
        const result = await require(database).delete(mapMarkers).where(eq(mapMarkers.id, id)).limit(1);
        return result.changes > 0;
    },
    
    queryMarkerById: async (id: number) => {
        const models = await require(database).select().from(mapMarkers).where(eq(mapMarkers.id, id)).limit(1);
        return models.length > 0 ? models[0] as MapMarkerModel : null;
    },
    
    queryMarkers: async () => {
        const models = await require(database).select().from(mapMarkers);
        return models as MapMarkerList;
    },
    
    updateMarker: async (id: number, title: string | null, description: string | null) => {
        const values: MapMarker$Insertion = { title: title, description: description };
        const result = await require(database).update(mapMarkers).set(values).where(eq(mapMarkers.id, id)).limit(1);
        return result.changes > 0;
    },
    
    // -------------- MAP MARKER IMAGES CRUD ---------------------------------------------------------------------------
    
    createMarkerImage: async (markerId: number, url: string) => {
        const values: MapMarkerImage$Insertion = { markerId: markerId, url: url }
        const models = await require(database).insert(mapMarkerImages).values(values).returning();
        return models[0]
    },
    
    deleteMarkerImage: async (id: number) => {
        const result = await require(database).delete(mapMarkerImages).where(eq(mapMarkerImages.id, id)).limit(1)
        return result.changes > 0
    },

    queryMarkerImages: async (markerId: number) => {
        return require(database).select().from(mapMarkerImages).where(eq(mapMarkerImages.markerId, markerId));
    },
})

function require(database: Database | null): Database {
    if (database)
        return database;

    throw new Error("Database is required to perform this action!")
}