import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingView() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});