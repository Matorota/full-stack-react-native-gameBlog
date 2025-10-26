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
import AppHeader from "./AppHeader";
import { useRouter } from "expo-router";

// Categories for filtering games - no longer importing from sample data
const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "apps" },
  { key: "games", label: "Games", icon: "game-controller" },
  { key: "consoles", label: "Consoles", icon: "tv" },
  { key: "accessories", label: "Accessories", icon: "headset" },
  { key: "pc_components", label: "Pc Components", icon: "hardware-chip" },
  { key: "merchandise", label: "Merchandise", icon: "shirt" },
  { key: "collectibles", label: "Collectibles", icon: "trophy" },
  { key: "digital", label: "Digital", icon: "cloud-download" },
  { key: "other", label: "Other", icon: "ellipsis-horizontal" },
];

type Screen = "home" | "detail" | "form" | "auth" | "menu";

export default function GameMarketplace() {
  const router = useRouter();
  const {
    filteredListings,
    selectedCategory,
    setSelectedCategory,
    currentUser,
  } = useListings();
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const handleAddListing = () => {
    router.push("/add-mongo-game");
  };

  const handleListingPress = (listing: Listing) => {
    console.log("Listing pressed:", listing.title);
    // TODO: Navigate to detail screen
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <AppHeader />

      {/* Search Bar */}
      <GameSearchBar />

      {/* Categories - Modern Chip Design */}
      <View className="bg-slate-800 px-4 py-6 border-b border-slate-600">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 4 }}
        >
          {CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key as any)}
              className={`mx-1 px-5 py-2.5 rounded-full ${
                selectedCategory === category.key
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/25"
                  : "bg-slate-700 border border-slate-600"
              }`}
              style={{
                shadowColor:
                  selectedCategory === category.key ? "#10B981" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: selectedCategory === category.key ? 0.3 : 0,
                shadowRadius: 4,
                elevation: selectedCategory === category.key ? 4 : 0,
              }}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={category.icon as any}
                  size={18}
                  color={
                    selectedCategory === category.key ? "white" : "#94a3b8"
                  }
                />
                <Text
                  className={`ml-2 text-sm font-semibold ${
                    selectedCategory === category.key
                      ? "text-white"
                      : "text-slate-300"
                  }`}
                >
                  {category.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Listings */}
      <ScrollView className="flex-1 px-6 pt-6">
        {filteredListings.length === 0 ? (
          <GameEmptyState onAddListing={handleAddListing} />
        ) : (
          <View className="space-y-4">
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
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
