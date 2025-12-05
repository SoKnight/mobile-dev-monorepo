import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import AdaptiveImage from '@/components/AdaptiveImage';
import {MapMarkerImageList} from "@/types";

interface Params {
    markerImages: MapMarkerImageList;
    addMarkerImage: (imageUrl: string) => Promise<void>;
    removeMarkerImage: (id: number) => Promise<boolean>;
}

export default function MarkerDetailsView({markerImages, addMarkerImage, removeMarkerImage}: Params) {
    const onAddButtonPress = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const imageUrl = result.assets[0].uri
                await addMarkerImage(imageUrl);
            }
        } catch (error) {
            Alert.alert("Ошибка!", "Не удалось открыть диалог выбора фото, попробуйте еще раз.")
            console.error("Couldn't add marker image!", error)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Pressable style={styles.addButton} onPress={onAddButtonPress}>
                    <FontAwesome name="picture-o" size={16} color="#000" />
                    <Text style={styles.addButtonText}>Добавить фото</Text>
                </Pressable>
            </View>

            <View style={styles.imageView}>
                {markerImages.map((markerImage, index) => (
                    <View key={index} style={styles.imageItem}>
                        <AdaptiveImage imageKey={index} imageUrl={markerImage.url} />
                        <Pressable
                            style={styles.imageDeleteButton}
                            hitSlop={8}
                            onPress={() => removeMarkerImage(markerImage.id)}
                        >
                            <FontAwesome name="trash" size={16} color="#fff" />
                        </Pressable>
                    </View>
                ))}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: 'rgba(0, 0, 0, .1)',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  addButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 500,
  },

  imageView: {
    flex: 1,
    gap: 12,
  },

  imageItem: {
    position: 'relative',

    borderRadius: 18,
    overflow: 'hidden',
  },

  imageDeleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,

    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: '50%',
  },
});