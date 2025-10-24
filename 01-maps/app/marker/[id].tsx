import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { SafeAreaInsetsContext, SafeAreaProvider } from "react-native-safe-area-context";

import ErrorView from "@/components/view/ErrorView";
import MarkerDetailsView from "@/components/view/MarkerDetailsView";
import { queryMapMarker } from "@/storage/InMemoryStorage";
import { NavigationParams } from "@/types";
import { useNavBarStyle } from "@/util/NavBarTweaks";

export default function MarkerDetails() {
    useNavBarStyle()

    const { id } = useLocalSearchParams<NavigationParams["markerId"]>()
    const markerId = Number(id)

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Маркер #${id}`,
        });
    }, [id]);

    const marker = queryMapMarker(markerId)
    if (!marker)
        return <ErrorView text={`Неизвестный маркер #${markerId} :(`} />

    const router = useRouter()

    const onMarkerDelete = (id: number) => {
        ToastAndroid.show(`Маркер #${id} удален`, ToastAndroid.SHORT)
        router.push('/')
    }

    return (
        <SafeAreaProvider style={{flex: 1}}>
            <SafeAreaInsetsContext.Consumer>
                {insets =>
                    <View style={{paddingBottom: insets?.bottom}}>
                        <ScrollView>
                            <MarkerDetailsView marker={marker} onMarkerDelete={onMarkerDelete} />
                        </ScrollView>
                    </View>
                }
            </SafeAreaInsetsContext.Consumer>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
