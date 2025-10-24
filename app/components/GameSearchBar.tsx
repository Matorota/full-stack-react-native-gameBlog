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
    <View className="bg-gray-800 px-4 py-3 border-b border-gray-700">
      <View className="bg-gray-700 rounded-xl shadow-sm border border-gray-600">
        <View className="flex-row items-center px-4 py-3">
          <Ionicons name="search" size={20} color="#10B981" />
          <TextInput
            className="flex-1 ml-3 text-base text-white"
            placeholder="Ieškoti žaidimų, konsolių..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="ml-2">
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
