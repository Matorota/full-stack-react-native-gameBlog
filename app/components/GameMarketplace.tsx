import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Listing, Category } from "../types";
import { useListingContext } from "../contexts/ListingContext";
import GameListingCard from "./GameListingCard";
import GameSearchBar from "./GameSearchBar";
import GameEmptyState from "./GameEmptyState";
import AppHeader from "./AppHeader";
import SimpleFilter from "./SimpleFilter";

export default function GameMarketplace() {
  const {
    filteredListings,
    selectedCategory,
    setSelectedCategory,
    currentUser,
  } = useListingContext();
  const router = useRouter();

  const handleListingPress = (listing: Listing) => {
    console.log("Listing pressed:", listing.title);
  };

  const handleManageGames = () => {
    if (!currentUser) {
      Alert.alert(
        "Access Restricted",
        "You need to sign in to manage games. Please log in to access this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push("/login") },
        ]
      );
      return;
    }
    router.push("/mongo-games-manager");
  };

  const handleAddGames = () => {
    if (!currentUser) {
      Alert.alert(
        "Access Restricted",
        "You need to sign in to add games. Please log in to access this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push("/login") },
        ]
      );
      return;
    }
    router.push("/add-mongo-game");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <AppHeader
        onManageGames={handleManageGames}
        onAddGames={handleAddGames}
      />

      <GameSearchBar />

      <SimpleFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ScrollView className="flex-1 px-6 pt-6">
        {filteredListings.length === 0 ? (
          <GameEmptyState onAddListing={handleAddGames} />
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

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
