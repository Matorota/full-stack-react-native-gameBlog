import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useListings } from "../contexts/ListingContext";
import { Category, Listing } from "../types";

export default function EditGamePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings, updateListing } = useListings();

  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<Listing | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    img: "",
    contacts_nr: "",
    category: Category.GAMES,
  });

  useEffect(() => {
    if (id) {
      const foundGame = listings.find((listing) => listing.id === id);
      if (foundGame) {
        setGame(foundGame);
        setFormData({
          name: foundGame.title,
          description: foundGame.description,
          price: foundGame.price.toString(),
          img: foundGame.images[0] || "",
          contacts_nr: foundGame.contact.phone,
          category: foundGame.category,
        });
      } else {
        Alert.alert("Error", "Game not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    }
  }, [id, listings]);

  const handleSubmit = async () => {
    if (!game) return;

    // Validate form
    if (!formData.name.trim()) {
      Alert.alert("Error", "Game name is required");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Description is required");
      return;
    }
    if (!formData.price.trim()) {
      Alert.alert("Error", "Price is required");
      return;
    }
    if (!formData.contacts_nr.trim()) {
      Alert.alert("Error", "Contact number is required");
      return;
    }

    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      // Convert form data to updates
      const updates = {
        title: formData.name,
        description: formData.description,
        price: priceNumber,
        images: formData.img ? [formData.img] : [],
        contact: {
          ...game.contact,
          phone: formData.contacts_nr,
        },
        category: formData.category,
      };

      await updateListing(game.id, updates);

      Alert.alert("Success", "Game updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating game:", error);
      Alert.alert("Error", "Failed to update game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!game) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-slate-400 mt-4">Loading game...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="p-10">
        {/* Header */}
        <View className="mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-6 self-start"
          >
            <Text className="text-emerald-400 text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white mb-2">Edit Game</Text>
          <Text className="text-slate-400">
            Update "{game.title}" in your MongoDB collection
          </Text>
        </View>

        {/* Form */}
        <View className="bg-slate-800 rounded-xl shadow-sm p-10 space-y-8">
          {/* Game Name */}
          <View>
            <Text className="text-white font-semibold mb-3 text-lg">
              Game Name *
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter game name"
              placeholderTextColor="#94A3B8"
              className="border-2 border-slate-600 rounded-xl px-5 py-4 text-white text-lg bg-slate-700"
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-white font-semibold mb-3 text-lg">
              Description *
            </Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Describe the game..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              className="border-2 border-slate-600 rounded-xl px-5 py-4 text-white text-lg bg-slate-700 h-32"
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          {/* Price */}
          <View>
            <Text className="text-white font-semibold mb-3 text-lg">
              Price (€) *
            </Text>
            <TextInput
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              className="border-2 border-slate-600 rounded-xl px-5 py-4 text-white text-lg bg-slate-700"
            />
          </View>

          {/* Image URL */}
          <View>
            <Text className="text-white font-semibold mb-3 text-lg">
              Image URL
            </Text>
            <TextInput
              value={formData.img}
              onChangeText={(text) => setFormData({ ...formData, img: text })}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              className="border-2 border-slate-600 rounded-xl px-5 py-4 text-white text-lg bg-slate-700"
            />
            {formData.img && (
              <View className="mt-4">
                <Text className="text-slate-400 text-sm mb-2">Preview:</Text>
                <Image
                  source={{ uri: formData.img }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                  onError={() =>
                    Alert.alert(
                      "Error",
                      "Failed to load image. Please check the URL."
                    )
                  }
                />
              </View>
            )}
          </View>

          {/* Contact Number */}
          <View>
            <Text className="text-white font-semibold mb-3 text-lg">
              Contact Number *
            </Text>
            <TextInput
              value={formData.contacts_nr}
              onChangeText={(text) =>
                setFormData({ ...formData, contacts_nr: text })
              }
              placeholder="+370 600 00000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              className="border-2 border-slate-600 rounded-xl px-5 py-4 text-white text-lg bg-slate-700"
            />
          </View>

          {/* Category */}
          <View>
            <Text className="text-white font-semibold mb-3 text-lg">
              Category
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {Object.values(Category).map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setFormData({ ...formData, category })}
                  className={`px-5 py-3 rounded-full border-2 ${
                    formData.category === category
                      ? "bg-emerald-600 border-emerald-600"
                      : "bg-slate-700 border-slate-600"
                  }`}
                >
                  <Text
                    className={`capitalize ${
                      formData.category === category
                        ? "text-white font-semibold"
                        : "text-slate-300"
                    }`}
                  >
                    {category.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`py-5 px-10 rounded-xl mt-10 ${
              loading ? "bg-slate-600" : "bg-emerald-600"
            }`}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold ml-2 text-lg">
                  Updating Game...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-lg">
                Update Game in MongoDB
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Game Info */}
        <View className="mt-10 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <Text className="text-emerald-400 font-semibold mb-2 text-lg">
            ℹ️ Game Info
          </Text>
          <Text className="text-slate-300 text-base mb-2">
            <Text className="font-semibold">Original ID:</Text> {game.id}
          </Text>
          <Text className="text-slate-300 text-base">
            <Text className="font-semibold">Created:</Text>{" "}
            {new Date(game.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
