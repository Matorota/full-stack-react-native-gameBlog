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

      {/* Categories */}
      <View className="bg-slate-800 px-6 py-8 border-b border-slate-600">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          <View className="flex-row space-x-12">
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.key}
                onPress={() => setSelectedCategory(category.key as any)}
                className={`px-4 py-3 rounded-xl border min-w-[100px] ${
                  selectedCategory === category.key
                    ? "bg-emerald-500 border-emerald-400"
                    : "bg-slate-700/80 border-slate-600"
                }`}
              >
                <View className="flex-row items-center justify-center space-x-1">
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={
                      selectedCategory === category.key ? "white" : "#94a3b8"
                    }
                  />
                  <Text
                    className={`text-sm font-medium ${
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
          </View>
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
