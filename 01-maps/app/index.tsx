import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import Map from "@/components/Map";
import { globalMapMarkerList, MapMarkerList, nextMapMarker } from "@/storage/InMemoryStorage";

export default function Index() {
  const [markers, setMarkers] = useState<MapMarkerList>(globalMapMarkerList)
  const router = useRouter()
  
  const onMapViewLongPress = (event: any) => {
    const marker = nextMapMarker(event.coordinate)
    setMarkers([...markers, marker])
  }
  
  const onMapMarkerPress = (id: number) => {
    router.push({
      pathname: "/marker/[id]",
      params: { id },
    })
  }
  
  return (
    <View style={styles.container}>
      <Map
        markers={markers}
        onMapViewLongPress={onMapViewLongPress}
        onMapMarkerPress={onMapMarkerPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
