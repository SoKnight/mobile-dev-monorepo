import { useEffect, useState } from "react";
import { Image, View } from "react-native";

interface Props {
    imageKey: any;
    imageUrl: string;
}

export default function AdaptiveImage({imageKey, imageUrl}: Props) {
    const [ratio, setRatio] = useState<number | null>(null); // width / height

    useEffect(() => {
        let mounted = true;
        Image.getSize(
            imageUrl,
            (w, h) => mounted && setRatio(w / h),
            () => mounted && setRatio(1),
        );
        return () => { mounted = false; };
    }, [imageKey, imageUrl]);

    if (!ratio)
        return <View
            style={{
                width: '100%',
                aspectRatio: 1,
                backgroundColor: "rgba(0, 0, 0, .05)",
            }}
        />;

    return (
        <Image
            key={imageKey}
            source={{uri: imageUrl}}
            style={{width: '100%', aspectRatio: ratio}}
            resizeMode='cover'
        />
    );
}