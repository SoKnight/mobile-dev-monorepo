import { MapMarkerModel, MapMarkerImageModel } from "@/types";

export type MapMarkerStore = Map<number, MapMarkerModel>
export type MapMarkerPhotoStore = Map<number, MapMarkerImageModel>

export const globalMapMarkerStore: MapMarkerStore = new Map()
export const globalMapMarkerImageStore: MapMarkerPhotoStore = new Map()

export type MapMarkerList = MapMarkerModel[]
export type MapMarkerPhotoList = MapMarkerImageModel[]

export function globalMapMarkerList() {
    return Array.from(globalMapMarkerStore.values())
}

export function mapMarkerPhotoList(photoIds: number[]) {
    return Array.from(globalMapMarkerImageStore.values())
}

export function nextMapMarkerId() {
    return globalMapMarkerStore.size + 1;
}

export function nextMapMarkerImageId() {
    return globalMapMarkerImageStore.size + 1;
}