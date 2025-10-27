import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useListings } from "../contexts/ListingContext";
import { Listing, Category } from "../types";
import GameListingCard from "./GameListingCard";
import GameSearchBar from "./GameSearchBar";
import GameEmptyState from "./GameEmptyState";
import AppHeader from "./AppHeader";
import CategoryFilter from "./CategoryFilter";

type Screen = "home" | "detail" | "form" | "auth" | "menu";

export default function GameMarketplace() {
  const {
    filteredListings,
    selectedCategory,
    setSelectedCategory,
    currentUser,
  } = useListings();
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const handleListingPress = (listing: Listing) => {
    console.log("Listing pressed:", listing.title);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <AppHeader />

      <GameSearchBar />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ScrollView className="flex-1 px-6 pt-6">
        {filteredListings.length === 0 ? (
          <GameEmptyState
            onAddListing={() => console.log("Add game from empty state")}
          />
        ) : (
          <View className="space-y-4">
            {filteredListings.map((listing: Listing) => (
              <GameListingCard
                key={listing.id}
                listing={listing}
                onPress={() => handleListingPress(listing)}
                onEdit={() => console.log("Edit game - navigation coming soon")}
              />
            ))}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
