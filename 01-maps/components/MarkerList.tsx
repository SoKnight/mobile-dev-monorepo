import { Marker } from "react-native-maps";

import { MapMarkerList } from "@/storage/InMemoryStorage";
import { MapMarkerModel } from "@/types";

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
                    title={marker.title || 'Новый маркер'}
                    description={marker.description}
                    onPress={() => onMapMarkerPress(marker.id)}
                />
            ))}
        </>
    )
}