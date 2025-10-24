import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Listing } from "../types";
import { useListings } from "../contexts/ListingContext";

interface GameListingCardProps {
  listing: Listing;
  onPress: () => void;
}

export default function GameListingCard({
  listing,
  onPress,
}: GameListingCardProps) {
  const router = useRouter();
  const { currentUser, deleteListing } = useListings();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("lt-LT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const targetDate = typeof date === "string" ? new Date(date) : date;
    const diffTime = Math.abs(now.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return targetDate.toLocaleDateString();
  };

  const handleEdit = () => {
    router.push(`/edit-game/${listing.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Game",
      `Are you sure you want to delete "${listing.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteListing(listing.id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete game.");
            }
          },
        },
      ]
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-4"
        activeOpacity={0.9}
      >
        {/* Image Section */}
        <View className="h-48 relative overflow-hidden">
          {listing.images?.[0] ? (
            <Image
              source={{ uri: listing.images[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 items-center justify-center">
              <Ionicons name="game-controller" size={48} color="white" />
              <Text className="text-white text-sm mt-2 font-medium opacity-90">
                {listing.platform || "Gaming"}
              </Text>
            </View>
          )}

          {/* Price Badge */}
          <View className="absolute top-3 right-3 bg-green-500 px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-bold">
              {formatPrice(listing.price)}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="p-4">
          {/* Title and Description */}
          <View className="mb-3">
            <Text className="text-lg font-bold text-white" numberOfLines={1}>
              {listing.title}
            </Text>
            <Text className="text-sm text-gray-400 mt-1" numberOfLines={2}>
              {listing.description}
            </Text>
          </View>

          {/* Contact Info */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="call" size={14} color="#10B981" />
              <Text className="text-green-400 text-sm ml-1">
                {listing.contact.phone}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">
              {formatTimeAgo(listing.createdAt)}
            </Text>
          </View>

          {/* MongoDB Actions */}
          <View className="flex-row justify-end pt-3 border-t border-gray-700 space-x-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="bg-blue-100 px-3 py-1 rounded-lg"
            >
              <Text className="text-blue-600 text-xs font-medium">✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-100 px-3 py-1 rounded-lg"
            >
              <Text className="text-red-600 text-xs font-medium">
                🗑️ Delete
              </Text>
            </TouchableOpacity>
          </View>

          {/* MongoDB ID */}
          <View className="mt-2 pt-2 border-t border-gray-700">
            <Text className="text-gray-500 text-xs">
              ID: {listing.id.slice(0, 8)}...
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
