import { mapMarkerImages, mapMarkers } from "./database/schema";

export type MapMarkerModel = typeof mapMarkers.$inferSelect
export type MapMarkerList = MapMarkerModel[]

export type MapMarkerImageModel = typeof mapMarkerImages.$inferSelect
export type MapMarkerImageList = MapMarkerImageModel[]

export interface NavigationParams {
    markerId: { id: string };
}