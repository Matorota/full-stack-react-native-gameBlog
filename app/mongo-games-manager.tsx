import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useListings } from "./contexts/ListingContext";
import { Listing } from "./types";

export default function MongoGamesPage() {
  const router = useRouter();
  const { listings, deleteListing } = useListings();
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    // The listings will be automatically refreshed through the context
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDelete = async (listing: Listing) => {
    Alert.alert(
      "Delete Game",
      `Are you sure you want to delete "${listing.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(listing.id);
            try {
              await deleteListing(listing.id);
              Alert.alert("Success", "Game deleted successfully!");
            } catch (error) {
              console.error("Error deleting game:", error);
              Alert.alert("Error", "Failed to delete game. Please try again.");
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("lt-LT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4 self-start"
          >
            <Text className="text-blue-500 text-lg">← Back</Text>
          </TouchableOpacity>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold text-gray-800">
              MongoDB Games
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/add-mongo-game")}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">+ Add Game</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-gray-600">
            {listings.length} games in your collection
          </Text>
        </View>

        {/* Games List */}
        {listings.length === 0 ? (
          <View className="bg-white rounded-xl shadow-sm p-8 items-center">
            <Text className="text-6xl mb-4">🎮</Text>
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              No Games Yet
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Start building your game collection by adding your first game to
              MongoDB!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/add-mongo-game")}
              className="bg-blue-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">
                Add Your First Game
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {listings.map((listing) => (
              <View
                key={listing.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <View className="p-4">
                  <View className="flex-row">
                    {/* Game Image */}
                    <View className="w-20 h-20 mr-4">
                      {listing.images && listing.images[0] ? (
                        <Image
                          source={{ uri: listing.images[0] }}
                          className="w-full h-full rounded-lg"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full bg-gray-200 rounded-lg items-center justify-center">
                          <Text className="text-gray-400 text-2xl">🎮</Text>
                        </View>
                      )}
                    </View>

                    {/* Game Info */}
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-800 mb-1">
                        {listing.title}
                      </Text>
                      <Text
                        className="text-gray-600 text-sm mb-2"
                        numberOfLines={2}
                      >
                        {listing.description}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-blue-600">
                          {formatPrice(listing.price)}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-gray-500 text-sm mr-2">
                            {listing.contact.phone}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row justify-end mt-4 space-x-2">
                    <TouchableOpacity
                      onPress={() => router.push(`/edit-game/${listing.id}`)}
                      className="bg-gray-100 px-4 py-2 rounded-lg"
                    >
                      <Text className="text-gray-700 font-medium"> Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(listing)}
                      disabled={deleting === listing.id}
                      className={`px-4 py-2 rounded-lg ${
                        deleting === listing.id ? "bg-gray-300" : "bg-red-100"
                      }`}
                    >
                      {deleting === listing.id ? (
                        <View className="flex-row items-center">
                          <ActivityIndicator size="small" color="#DC2626" />
                          <Text className="text-red-600 font-medium ml-1">
                            Deleting...
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-red-600 font-medium">Delete</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Metadata */}
                  <View className="mt-3 pt-3 border-t border-gray-100">
                    <View className="flex-row justify-between text-xs">
                      <Text className="text-gray-400">
                        ID: {listing.id.slice(0, 8)}...
                      </Text>
                      <Text className="text-gray-400">
                        Category: {listing.category}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer Info */}
        <View className="mt-8 bg-green-50 rounded-lg p-4">
          <Text className="text-green-800 font-semibold mb-1">
            MongoDB Status
          </Text>
          <Text className="text-green-700 text-sm">
            Connected to MongoDB Atlas. All changes are saved in real-time to
            your database.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
