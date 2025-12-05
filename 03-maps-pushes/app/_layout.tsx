import { DatabaseProvider } from "@/context/DatabaseContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="marker/[id]" options={{headerTitle: 'Маркер', statusBarStyle: 'dark'}}/>
      </Stack>
    </DatabaseProvider>
  );
}
