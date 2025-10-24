import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useListings } from "../contexts/ListingContext";
import { Listing } from "../types";
import GameListingCard from "./GameListingCard";
import GameSearchBar from "./GameSearchBar";
import GameEmptyState from "./GameEmptyState";
import ConnectionStatusIndicator from "./ConnectionStatusIndicator";

// Categories for filtering games - no longer importing from sample data
const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: "all", label: "Visos", icon: "apps" },
  { key: "action", label: "Action", icon: "game-controller" },
  { key: "rpg", label: "RPG", icon: "game-controller" },
  { key: "sports", label: "Sports", icon: "football" },
];

type Screen = "home" | "detail" | "form" | "auth" | "menu";

export default function GameMarketplace() {
  const {
    filteredListings,
    selectedCategory,
    setSelectedCategory,
    currentUser,
  } = useListings();
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const handleAddListing = () => {
    if (!currentUser) {
      setCurrentScreen("auth");
      return;
    }
    setCurrentScreen("form");
  };

  const handleListingPress = (listing: Listing) => {
    console.log("Listing pressed:", listing.title);
    // TODO: Navigate to detail screen
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar style="light" />

      {/* Header */}
      <View className="bg-gray-800 px-4 py-4 shadow-lg border-b border-gray-700">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="p-2 -ml-2">
            <Ionicons name="menu" size={24} color="#10B981" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <View className="flex-row items-center">
              <Ionicons name="game-controller" size={28} color="#10B981" />
              <Text className="text-2xl font-bold text-white ml-2">
                GameHub
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Text className="text-sm text-gray-400">
                {filteredListings.length} prekių
              </Text>
              {currentUser && (
                <View className="flex-row items-center ml-3">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  <Text className="text-xs text-green-400">Online</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleAddListing}
            className="bg-green-500 p-3 rounded-full shadow-lg"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Connection Status Indicator */}
      <ConnectionStatusIndicator />

      {/* Search Bar */}
      <GameSearchBar />

      {/* Categories */}
      <View className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.key}
                onPress={() => setSelectedCategory(category.key as any)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category.key
                    ? "bg-green-500 border-green-500"
                    : "bg-gray-700 border-gray-600"
                }`}
              >
                <View className="flex-row items-center space-x-2">
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={
                      selectedCategory === category.key ? "white" : "#9CA3AF"
                    }
                  />
                  <Text
                    className={`text-sm font-medium ${
                      selectedCategory === category.key
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {category.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Listings */}
      <ScrollView className="flex-1 px-4 pt-4">
        {filteredListings.length === 0 ? (
          <GameEmptyState onAddListing={handleAddListing} />
        ) : (
          <View>
            {filteredListings.map((listing: Listing) => (
              <GameListingCard
                key={listing.id}
                listing={listing}
                onPress={() => handleListingPress(listing)}
              />
            ))}
          </View>
        )}

        {/* Bottom padding */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
