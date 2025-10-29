import React from "react";
import { View } from "react-native";
import GameMarketplace from "./components/GameMarketplace";

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <GameMarketplace />
    </View>
  );
}
