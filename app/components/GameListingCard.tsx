import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Listing } from "../types";

interface GameListingCardProps {
  listing: Listing;
  onPress: () => void;
}

export default function GameListingCard({
  listing,
  onPress,
}: GameListingCardProps) {
  const [expanded, setExpanded] = useState(false);
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

  const handleBuy = () => {
    Alert.alert(
      "Contact Seller",
      `Contact details for "${listing.title}":\n\nPhone: ${listing.contact.phone}\nEmail: ${listing.contact.email}\n\nPrice: ${formatPrice(listing.price)}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Call seller") },
        { text: "OK", style: "default" },
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
        <View className="p-5">
          <View className="flex-row">
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

          <View className="flex-row items-center mt-3">
            <Ionicons name="call" size={14} color="#10B981" />
            <Text className="text-emerald-400 text-sm ml-2">
              {listing.contact.phone}
            </Text>
          </View>
        </View>

        {expanded && (
          <View className="bg-slate-700/50 px-5 py-4 border-t border-slate-600">
            <View className="flex-row justify-center">
              <TouchableOpacity
                onPress={handleBuy}
                className="bg-emerald-500 px-8 py-4 rounded-xl flex-1 max-w-xs"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="call" size={18} color="white" />
                  <Text className="text-white text-lg font-semibold ml-2">
                    Buy Now
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="mt-4 pt-3 border-t border-slate-600">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-slate-300 text-sm">Contact:</Text>
                  <Text className="text-emerald-400 text-base font-medium">
                    {listing.contact.phone}
                  </Text>
                </View>
                <View>
                  <Text className="text-slate-300 text-sm">Posted:</Text>
                  <Text className="text-slate-400 text-sm">
                    {formatTimeAgo(listing.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
