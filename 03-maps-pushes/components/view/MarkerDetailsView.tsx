import React, {useCallback, useState} from "react";
import { Alert, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";

import Button from "@/components/Button";
import MarkerGalleryView from "@/components/view/MarkerGalleryView";
import {MapMarkerImageList, MapMarkerModel} from "@/types";
import {useDatabase} from "@/context/DatabaseContext";
import LoadingView from "@/components/view/LoadingView";
import ErrorView from "@/components/view/ErrorView";
import {useFocusEffect, useRouter} from "expo-router";
import {notificationService} from "@/services/notifications";

interface Params {
    marker: MapMarkerModel;
}

export default function MarkerDetailsView({marker}: Params) {
    const { deleteMarker, updateMarker, createMarkerImage, deleteMarkerImage, queryMarkerImages } = useDatabase()
    const router = useRouter()

    const [title, setTitle] = useState<string>(marker.title ?? "")
    const [description, setDescription] = useState<string>(marker.description ?? "")
    const [markerImages, setMarkerImages] = useState<MapMarkerImageList | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            queryMarkerImages(marker.id)
                .then(setMarkerImages)
                .catch((reason) => handleQueryMarkerImagesFailure(reason, marker.id))
                .finally(() => setLoading(false))
        }, [marker.id, queryMarkerImages])
    );

    const handleQueryMarkerImagesFailure = (reason: any, id: number) => {
        console.log(`Couldn't query images of marker #${id}:`, reason)
        setMarkerImages(null)
    }

    if (loading)
        return <LoadingView />

    if (!markerImages)
        return <ErrorView text={`Не удалось загрузить изображения маркера #${marker.id} :(`} />

    const onTitleChange = async (title: string) => {
        try {
            const updated = await updateMarker(marker.id, title, description)
            if (updated) {
                marker.title = title
                setTitle(title)
                return
            } else {
                console.error(`Couldn't update title of marker #${marker.id}!`)
            }
        } catch (error) {
            console.error(`Couldn't update title of marker #${marker.id}:`, error)
        }

        ToastAndroid.show(`Не удалось обновить маркер #${marker.id}`, ToastAndroid.SHORT)
    }

    const onDescriptionChange = async (description: string) => {
        try {
            const updated = await updateMarker(marker.id, title, description)
            if (updated) {
                marker.description = description
                setDescription(description)
                return
            } else {
                console.error(`Couldn't update description of marker #${marker.id}!`)
            }
        } catch (error) {
            console.error(`Couldn't update description of marker #${marker.id}:`, error)
        }

        ToastAndroid.show(`Не удалось обновить маркер #${marker.id}`, ToastAndroid.SHORT)
    }

    const removeMarker = async (id: number) => {
        try {
            const deleted = await deleteMarker(id)
            if (deleted) {
                ToastAndroid.show(`Маркер #${id} удален`, ToastAndroid.SHORT)
                router.push('/')
                await notificationService.removeNotification(id)
                return
            } else {
                console.error(`Couldn't delete marker #${id}!`)
            }
        } catch (error) {
            console.error(`Couldn't delete marker #${id}:`, error)
        }

        ToastAndroid.show(`Не удалось удалить маркер #${id}`, ToastAndroid.SHORT)
    }

    const addMarkerImage = async (imageUrl: string) => {
        try {
            const added = await createMarkerImage(marker.id, imageUrl)
            setMarkerImages([...markerImages, added])
            return
        } catch (error) {
            console.error(`Couldn't add image for marker #${marker.id}:`, error)
        }

        ToastAndroid.show(`Не удалось добавить изображение к маркеру #${marker.id}`, ToastAndroid.SHORT)
    }

    const removeMarkerImage = async (id: number) => {
        try {
            const deleted = await deleteMarkerImage(id)
            if (deleted) {
                ToastAndroid.show(`Фото #${id} удалено`, ToastAndroid.SHORT)
                if (markerImages) {
                    setMarkerImages(markerImages.filter(image => image.id !== id))
                }
                return true
            } else {
                console.error(`Couldn't delete marker image #${id}!`)
            }
        } catch (error) {
            console.error(`Couldn't delete marker image #${id}:`, error)
        }

        Alert.alert("Ошибка!", "Не удалось выполнить удаление прикрепленного фото, попробуйте еще раз.")
        return false
    }

    return (
        <View style={styles.container}>
            <View style={[styles.widget, styles.locationWidget]}>
                <View style={styles.locationBlock}>
                    <Text style={styles.locationValue}>{marker.location.latitude.toFixed(10)}</Text>
                    <Text style={styles.locationHint}>Широта</Text>
                </View>
                <View style={styles.locationBlock}>
                    <Text style={styles.locationValue}>{marker.location.longitude.toFixed(10)}</Text>
                    <Text style={styles.locationHint}>Долгота</Text>
                </View>
            </View>

            <View style={[styles.widget, styles.metaWidget]}>
                <TextInput
                    style={styles.input}
                    value={title}
                    placeholder="Заголовок"
                    placeholderTextColor={'rgba(0, 0, 0, .5)'}
                    maxLength={40}
                    onChangeText={onTitleChange}
                />
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={description}
                    placeholder="Описание"
                    placeholderTextColor={'rgba(0, 0, 0, .5)'}
                    multiline
                    textAlignVertical="top"
                    onChangeText={onDescriptionChange}
                />
                <Button dangerous label="Удалить маркер" onButtonPressed={() => removeMarker(marker.id)} />
            </View>

            <View style={styles.imagesWidget}>
                <MarkerGalleryView markerImages={markerImages} addMarkerImage={addMarkerImage} removeMarkerImage={removeMarkerImage} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  widget: {
    backgroundColor: 'rgba(0, 0, 0, .05)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  locationWidget: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  locationBlock: {
    alignItems: 'center',
    width: '50%',
  },

  locationValue: {
    color: '#000',
    fontSize: 16,
    fontWeight: 500,
  },

  locationHint: {
    color: 'rgba(0, 0, 0, .75)',
    fontSize: 18,
    fontWeight: 400,
  },

  metaWidget: {
    gap: 12,
  },

  input: {
    borderColor: 'rgba(0, 0, 0, .1)',
    borderRadius: 18,
    borderWidth: 1,
    color: '#000',
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  multilineInput: {
    minHeight: 100,
  },

  imagesWidget: {
    flex: 1,
    gap: 12,
  },
});