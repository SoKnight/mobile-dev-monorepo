import {useLocalSearchParams, useNavigation} from "expo-router";
import React, {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";
import {SafeAreaInsetsContext, SafeAreaProvider} from "react-native-safe-area-context";

import ErrorView from "@/components/view/ErrorView";
import MarkerDetailsView from "@/components/view/MarkerDetailsView";
import {MapMarkerModel, NavigationParams} from "@/types";
import {useNavBarStyle} from "@/util/NavBarTweaks";
import {useDatabase} from "@/context/DatabaseContext";
import LoadingView from "@/components/view/LoadingView";

export default function MarkerDetails() {
    useNavBarStyle()

    const { id } = useLocalSearchParams<NavigationParams["markerId"]>()
    const navigation = useNavigation();

    const { queryMarkerById } = useDatabase()
    const [marker, setMarker] = useState<MapMarkerModel | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Маркер #${id}`,
        });
    }, [id, navigation]);

    useEffect(() => {
        setLoading(true);
        queryMarkerById(Number(id))
            .then(setMarker)
            .catch((reason) => handleQueryMarkerByIdFailure(reason, id))
            .finally(() => setLoading(false))
    }, [id, queryMarkerById]);

    const handleQueryMarkerByIdFailure = (reason: any, id: string) => {
        console.log(`Couldn't query marker #${id}:`, reason)
        setMarker(null)
    }

    if (loading)
        return <LoadingView />

    if (!marker)
        return <ErrorView text={`Не удалось найти маркер #${id} :(`} />

    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaInsetsContext.Consumer>
                {insets =>
                    <View style={{paddingBottom: insets?.bottom}}>
                        <ScrollView>
                            <MarkerDetailsView marker={marker} />
                        </ScrollView>
                    </View>
                }
            </SafeAreaInsetsContext.Consumer>
        </SafeAreaProvider>
    )
}
