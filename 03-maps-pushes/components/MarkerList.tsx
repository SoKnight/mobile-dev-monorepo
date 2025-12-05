import { Marker } from "react-native-maps";

import {MapMarkerList, MapMarkerModel} from "@/types";

interface Props {
    markers: MapMarkerList;
    onMapMarkerPress: (id: number) => void;
}

export default function MarkerList({markers, onMapMarkerPress}: Props) {
    return (
        <>
            {markers.map((marker: MapMarkerModel) => (
                <Marker
                    key={marker.id}
                    coordinate={marker.location}
                    title={marker.title || `Маркер #${marker.id}`}
                    description={marker.description || ''}
                    pinColor={'blue'}
                    onPress={() => onMapMarkerPress(marker.id)}
                />
            ))}
        </>
    )
}