import {useFocusEffect, useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import {StyleSheet, View} from "react-native";

import Map from "@/components/Map";
import {MapMarkerList} from "@/types";
import {useDatabase} from "@/context/DatabaseContext";
import ErrorView from "@/components/view/ErrorView";
import LoadingView from "@/components/view/LoadingView";

export default function Index() {
    const { createMarker, queryMarkers } = useDatabase()
    const [markers, setMarkers] = useState<MapMarkerList | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter()

    useFocusEffect(
        useCallback(() => {
            setLoading(true)
            queryMarkers()
                .then(setMarkers)
                .catch(handleQueryMarkersFailure)
                .finally(() => setLoading(false))
        }, [queryMarkers])
    );

    const handleQueryMarkersFailure = (reason: any) => {
        console.log("Couldn't query markers:", reason)
        setMarkers(null)
    }

    if (loading)
        return <LoadingView />

    if (!markers)
        return <ErrorView text={"Не удалось загрузить список маркеров :("} />

    const onMapViewLongPress = async (event: any) => {
        const marker = await createMarker(event.coordinate)
        setMarkers([...markers, marker])
    }

    const onMapMarkerPress = (id: number) => {
        router.push({
            pathname: "/marker/[id]",
            params: {id},
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
