import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import Map from "@/components/Map"
import { globalMapMarkerList, globalMapMarkerStore, MapMarkerList, nextMapMarkerId } from "@/storage/InMemoryStorage";
import { MapMarkerModel } from "@/types";

export default function Index() {
  const [markers, setMarkers] = useState<MapMarkerList>(globalMapMarkerList)
  const router = useRouter()
  
  const onMapViewLongPress = (event: any) => {
    const marker: MapMarkerModel = {
      id: nextMapMarkerId(),
      location: event.coordinate,
    }
    
    globalMapMarkerStore.set(marker.id, marker)
    setMarkers([...markers, marker])
  }
  
  const onMapMarkerPress = (id: number) => {
    // TODO code
  }
  
  return (
    <View style={styles.container}>
    <Map markers={markers} onMapViewLongPress={onMapViewLongPress} onMapMarkerPress={onMapMarkerPress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
