import { Stack } from "expo-router";
import { ListingProvider } from "./contexts/ListingContext";
import NavigationErrorBoundary from "./components/NavigationErrorBoundary";
import "./global.css";

export default function RootLayout() {
  return (
    <NavigationErrorBoundary>
      <ListingProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ListingProvider>
    </NavigationErrorBoundary>
  );
}
