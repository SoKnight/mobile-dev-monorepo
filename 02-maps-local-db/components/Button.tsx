import { Pressable, StyleSheet, Text, View } from "react-native";

interface Params {
    dangerous?: boolean;
    label: string;
    onButtonPressed?: () => void
}

export default function Button({dangerous, label, onButtonPressed}: Params) {
    return (
        <View style={styles.container}>
            <Pressable
                style={dangerous ? [styles.button, styles.dangerousButton] : styles.button}
                onPress={onButtonPressed}
            >
                <Text style={styles.buttonText}>{label}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#0066FE',
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  dangerousButton: {
    backgroundColor: '#FF4337',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
  },
});