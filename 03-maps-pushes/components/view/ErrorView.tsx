import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

interface Props {
    caption?: string;
    text?: string;
}

export default function ErrorView({caption, text}: Props) {
    const effectiveCaption = caption ?? "ОШИБКА"
    const effectiveText = text ?? "Произошла неизвестная ошибка, поплачьте :("
    const router = useRouter()

    return (
        <View style={styles.container}>
            <Text style={styles.errorCaption}>{effectiveCaption}</Text>
            <Text style={styles.errorText}>{effectiveText}</Text>
            <Button label="Вернуться к карте" onButtonPressed={() => router.push('/')} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    flex: 1,
    paddingHorizontal: 40,
  },

  errorCaption: {
    color: '#000',
    fontSize: 24,
    fontWeight: 600,
  },

  errorText: {
    color: 'rgba(0, 0, 0, .75)',
    fontSize: 24,
    marginBottom: 36,
  },
});