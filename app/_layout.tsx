import { Stack } from "expo-router";
import { ListingProvider } from "./contexts/ListingContext";
import "./global.css";

export default function RootLayout() {
  return (
    <ListingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ListingProvider>
  );
}
