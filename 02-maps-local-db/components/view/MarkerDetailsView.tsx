import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";

import Button from "@/components/Button";
import MarkerGalleryView from "@/components/view/MarkerGalleryView";
import { dropMapMarker, dropMapMarkerImage, mapMarkerImageList, nextMapMarkerImage } from "@/storage/InMemoryStorage";
import { MapMarkerModel } from "@/types";

interface Params {
    marker: MapMarkerModel;
    onMarkerDelete?: (id: number) => void;
}

export default function MarkerDetailsView({marker, onMarkerDelete}: Params) {
    const imageIds = marker.imageIds ?? []
    const imageModels = mapMarkerImageList(imageIds)

    const [title, setTitle] = useState<string>(marker.title ?? "")
    const [description, setDescription] = useState<string>(marker.description ?? "")
    const [imageUrls, setImageUrls] = useState<string[]>(imageModels.map((imageModel) => imageModel.url))

    const deleteMarker = (id: number) => {
        dropMapMarker(id)
        if (onMarkerDelete) onMarkerDelete(id)
    }

    const onTitleChange = (title: string) => {
        marker.title = title
        setTitle(title)
    }

    const onDescriptionChange = (description: string) => {
        marker.description = description
        setDescription(description)
    }

    const onImageAdd = (imageUrl: string) => {
        const imageId = nextMapMarkerImage(imageUrl).id
        marker.imageIds = [...(marker.imageIds ?? []), imageId]
        setImageUrls([...imageUrls, imageUrl])
    }

    const imageDeleteFunction = (imageUrl: string, imageIndex: number) => {
        const imageModel = imageModels[imageIndex]
        if (imageModel?.url != imageUrl) {
            Alert.alert("Ошибка!", "Не удалось выполнить удаление прикрепленного фото, попробуйте еще раз.")
            return false
        }

        dropMapMarkerImage(imageModel.id)
        marker.imageIds = marker.imageIds?.filter((id, _) => id != imageModel.id)

        const filter = (_: string, index: number) => index != imageIndex
        setImageUrls((imageUrls) => imageUrls.filter(filter));

        ToastAndroid.show(`Фото #${imageModel.id} удалено`, ToastAndroid.SHORT)
        return true
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
                <Button dangerous label="Удалить маркер" onButtonPressed={() => deleteMarker(marker.id)} />
            </View>

            <View style={styles.imagesWidget}>
                <MarkerGalleryView imageUrls={imageUrls} imageDeleteFunction={imageDeleteFunction} onImageAdd={onImageAdd} />
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