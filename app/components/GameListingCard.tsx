import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
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
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
            setDeleting(true);
            try {
              await deleteListing(listing.id);
              Alert.alert("Success", "Game deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete game.");
            } finally {
              setDeleting(false);
              setExpanded(false);
            }
          },
        },
      ]
    );
  };

  const handleCardPress = () => {
    setExpanded(!expanded);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden mb-4"
        activeOpacity={0.9}
      >
        {/* Main Card Content */}
        <View className="p-5">
          <View className="flex-row">
            {/* Game Image */}
            <View className="w-20 h-20 mr-4">
              {listing.images?.[0] ? (
                <Image
                  source={{ uri: listing.images[0] }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-slate-600 rounded-xl items-center justify-center">
                  <Ionicons name="game-controller" size={24} color="#10B981" />
                </View>
              )}
            </View>

            {/* Game Info */}
            <View className="flex-1">
              <Text
                className="text-lg font-bold text-white mb-1"
                numberOfLines={1}
              >
                {listing.title}
              </Text>
              <Text className="text-slate-400 text-sm mb-2" numberOfLines={2}>
                {listing.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-emerald-500">
                  {formatPrice(listing.price)}
                </Text>
                <Ionicons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#94a3b8"
                />
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View className="flex-row items-center mt-3">
            <Ionicons name="call" size={14} color="#10B981" />
            <Text className="text-emerald-400 text-sm ml-2">
              {listing.contact.phone}
            </Text>
          </View>
        </View>

        {/* Expandable Actions */}
        {expanded && (
          <View className="bg-slate-700/50 px-5 py-4 border-t border-slate-600">
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={handleEdit}
                className="bg-slate-600 px-5 py-3 rounded-xl border border-slate-500"
              >
                <View className="flex-row items-center">
                  <Ionicons name="pencil" size={16} color="#94a3b8" />
                  <Text className="text-slate-300 text-sm font-medium ml-2">
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                disabled={deleting}
                className={`px-5 py-3 rounded-xl border ${
                  deleting
                    ? "bg-slate-500 border-slate-400"
                    : "bg-red-500/20 border-red-500/50"
                }`}
              >
                {deleting ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#94a3b8" />
                    <Text className="text-slate-400 text-sm font-medium ml-2">
                      Deleting...
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="trash" size={16} color="#ef4444" />
                    <Text className="text-red-400 text-sm font-medium ml-2">
                      Delete
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Game ID */}
            <View className="mt-3 pt-3 border-t border-slate-600">
              <Text className="text-slate-500 text-xs">
                ID: {listing.id.slice(0, 8)}...
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
