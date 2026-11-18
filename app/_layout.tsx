import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OffersProvider } from "./context/offersContext";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OffersProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </OffersProvider>
    </GestureHandlerRootView>
  );
}
