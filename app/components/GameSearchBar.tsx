import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useListings } from "../contexts/ListingContext";

export default function GameSearchBar() {
  const { searchQuery, setSearchQuery } = useListings();

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View className="bg-slate-800 px-6 py-4 border-b border-slate-600">
      <View className="bg-slate-700 rounded-2xl shadow-lg border border-slate-600">
        <View className="flex-row items-center px-5 py-4">
          <Ionicons name="search" size={22} color="#10B981" />
          <TextInput
            className="flex-1 ml-4 text-lg text-white"
            placeholder="Search games, consoles..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="ml-3">
              <Ionicons name="close-circle" size={22} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
