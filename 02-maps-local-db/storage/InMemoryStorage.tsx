import { MapMarkerImageModel, MapMarkerModel } from "@/types";
import { LatLng } from "react-native-maps";

type MapMarkerStore = Map<number, MapMarkerModel>
type MapMarkerImageStore = Map<number, MapMarkerImageModel>

const globalMapMarkerStore: MapMarkerStore = new Map()
const globalMapMarkerImageStore: MapMarkerImageStore = new Map()

export type MapMarkerList = MapMarkerModel[]
export type MapMarkerImageList = MapMarkerImageModel[]

export function globalMapMarkerList(): MapMarkerList {
    return Array.from(globalMapMarkerStore.values())
}

export function mapMarkerImageList(imageIds: number[]): MapMarkerImageList {
    const result: MapMarkerImageList = [];

    for (const imageId of imageIds) {
        const image = globalMapMarkerImageStore.get(imageId)
        if (image) {
            result.push(image)
        }
    }

    return result
}

export function queryMapMarker(id: number): MapMarkerModel | undefined {
    return globalMapMarkerStore.get(id)
}

export function nextMapMarker(location: LatLng): MapMarkerModel {
    const id = globalMapMarkerStore.size + 1;
    const model: MapMarkerModel = {id: id, location: location}
    globalMapMarkerStore.set(id, model)
    return model
}

export function nextMapMarkerImage(url: string): MapMarkerImageModel {
    const id = globalMapMarkerImageStore.size + 1;
    const model: MapMarkerImageModel = {id: id, url: url}
    globalMapMarkerImageStore.set(id, model)
    return model
}

export function dropMapMarker(id: number) {
    globalMapMarkerStore.delete(id)
}

export function dropMapMarkerImage(id: number) {
    globalMapMarkerImageStore.delete(id)
}