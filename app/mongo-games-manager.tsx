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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useListingContext } from "./contexts/ListingContext";

const useListings = () => {
  return useListingContext();
};
import { Listing } from "./types";

export default function MongoGamesPage() {
  const router = useRouter();
  const { listings, deleteListing } = useListings();
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
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
      className="flex-1 bg-slate-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-8">
        <View className="mb-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-8 self-start bg-slate-700 px-6 py-4 rounded-xl"
          >
            <Text className="text-white text-lg font-medium">← Back</Text>
          </TouchableOpacity>
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-4xl font-bold text-white">My Games</Text>
            <TouchableOpacity
              onPress={() => router.push("/add-mongo-game")}
              className="bg-emerald-600 px-8 py-4 rounded-xl shadow-sm border border-emerald-500"
            >
              <Text className="text-white font-semibold text-lg">
                + Add Game
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-slate-300 text-lg">
            {listings.length} games in your collection
          </Text>
        </View>

        {listings.length === 0 ? (
          <View className="bg-slate-800 rounded-2xl p-12 items-center border border-slate-700 shadow-lg">
            <View className="w-20 h-20 bg-slate-700 rounded-2xl items-center justify-center mb-6">
              <Text className="text-slate-400 text-xl font-bold">GAME</Text>
            </View>
            <Text className="text-2xl font-bold text-white mb-4">
              No Games Yet
            </Text>
            <Text className="text-slate-300 text-center mb-8 text-lg leading-relaxed">
              Start building your game collection by adding your first game!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/add-mongo-game")}
              className="bg-emerald-600 px-8 py-4 rounded-xl shadow-sm"
            >
              <Text className="text-white font-medium text-lg">
                Add Your First Game
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-12">
            {listings.map((listing) => (
              <View
                key={listing.id}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg mb-4"
              >
                <View className="p-10">
                  <View className="flex-row">
                    <View className="w-28 h-28 mr-8">
                      {listing.images && listing.images[0] ? (
                        <Image
                          source={{ uri: listing.images[0] }}
                          className="w-full h-full rounded-2xl"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full bg-slate-700 rounded-2xl items-center justify-center">
                          <Text className="text-slate-400 text-sm font-medium">
                            No Image
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-xl font-bold text-white mb-3">
                        {listing.title}
                      </Text>
                      <Text
                        className="text-slate-300 text-base mb-4"
                        numberOfLines={2}
                      >
                        {listing.description}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-emerald-400">
                          {formatPrice(listing.price)}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-slate-400 text-sm mr-2">
                            {listing.contact.phone}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-between mt-8 mx-4">
                    <TouchableOpacity
                      onPress={() => router.push(`/edit-game/${listing.id}`)}
                      className="flex-1 bg-emerald-600 px-5 py-3 rounded-xl mr-3 flex-row items-center justify-center shadow-lg"
                      style={{ elevation: 3 }}
                    >
                      <Ionicons name="create-outline" size={16} color="white" />
                      <Text className="text-white font-semibold text-sm ml-2">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(listing)}
                      disabled={deleting === listing.id}
                      className={`flex-1 px-5 py-3 rounded-xl ml-3 flex-row items-center justify-center shadow-lg ${
                        deleting === listing.id ? "bg-slate-600" : "bg-red-600"
                      }`}
                      style={{ elevation: 3 }}
                    >
                      {deleting === listing.id ? (
                        <>
                          <ActivityIndicator size="small" color="#ffffff" />
                          <Text className="text-white font-semibold text-sm ml-2">
                            Deleting...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color="white"
                          />
                          <Text className="text-white font-semibold text-sm ml-2">
                            Delete
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View className="mt-8 pt-6 border-t border-slate-600">
                    <View className="flex-row justify-between items-center">
                      <View className="bg-slate-700 px-3 py-1 rounded-full">
                        <Text className="text-slate-300 text-xs font-medium">
                          ID: {listing.id.slice(0, 8)}...
                        </Text>
                      </View>
                      <View className="bg-emerald-600/20 px-3 py-1 rounded-full">
                        <Text className="text-emerald-400 text-xs font-medium capitalize">
                          {listing.category.replace("_", " ")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
