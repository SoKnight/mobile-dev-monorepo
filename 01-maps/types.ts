import { LatLng } from "react-native-maps";

export interface MapMarkerImageModel {
    id: number;
    url: string;
}

export interface MapMarkerModel {
    id: number;
    location: LatLng;
    title?: string;
    description?: string;
    imageIds?: number[];
}

export interface NavigationParams {
    markerId: { id: string };
}