import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import AdaptiveImage from '@/components/AdaptiveImage';

interface Params {
    imageUrls: string[];
    imageDeleteFunction: (imageUrl: string, index: number) => boolean;
    onImageAdd?: (imageUrl: string) => void;
}

export default function MarkerDetailsView({imageUrls, imageDeleteFunction, onImageAdd}: Params) {
    const [imageSources, setImageSources] = useState(imageUrls)

    const onAddButtonPress = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const imageUrl = result.assets[0].uri
                if (onImageAdd) onImageAdd(imageUrl)
                setImageSources([...imageSources, imageUrl])
            }
        } catch (ex) {
            Alert.alert("Ошибка!", "Не удалось открыть диалог выбора фото, попробуйте еще раз.")
        }
    }

    const onImageDeleteButtonPress = (expectedUrl: string, expectedIndex: number) => {
        if (imageDeleteFunction(expectedUrl, expectedIndex)) {
            const filter = (_: string, index: number) => index != expectedIndex
            setImageSources((imageUrls) => imageUrls.filter(filter));
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
                {imageSources.map((url, index) => (
                    <View key={index} style={styles.imageItem}>
                        <AdaptiveImage imageKey={index} imageUrl={url} />
                        <Pressable
                            style={styles.imageDeleteButton}
                            hitSlop={8}
                            onPress={() => onImageDeleteButtonPress(url, index)}
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