import MapView, {LatLng, Marker} from "react-native-maps";
import { StyleSheet } from "react-native";

import MarkerList from "./MarkerList";
import {MapMarkerList} from "@/types";

interface Props {
    currentLocation: LatLng | null;
    markers: MapMarkerList;
    onMapViewLongPress: (event: any) => void;
    onMapMarkerPress: (id: number) => void;
}

export default function Map({currentLocation, markers, onMapViewLongPress, onMapMarkerPress}: Props) {
    return (
        <MapView
            style={styles.map}
            mapType="hybrid"
            initialRegion={{
                latitude: 58.007518,
                longitude: 56.186305,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            toolbarEnabled={false}
            loadingEnabled={true}
            onLongPress={(event: any) => onMapViewLongPress(event.nativeEvent)}
        >
            {currentLocation && <Marker coordinate={currentLocation} />}
            <MarkerList markers={markers} onMapMarkerPress={onMapMarkerPress} />
        </MapView>
    );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});