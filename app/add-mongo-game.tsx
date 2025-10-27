import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { useListings } from "./contexts/ListingContext";
import { Category } from "./types";

export default function AddGamePage() {
  const router = useRouter();
  const { addListing } = useListings();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    img: "",
    contacts_nr: "",
    category: Category.GAMES,
  });

  const handleSubmit = async () => {
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
      const listingData = {
        title: formData.name,
        description: formData.description,
        price: priceNumber,
        images: formData.img ? [formData.img] : [],
        contact: {
          name: "Game Seller",
          phone: formData.contacts_nr,
          email: "contact@gamehub.com",
        },
        category: formData.category,
        condition: "good" as const,
        platform: "PC",
        genre: "Action",
      };

      await addListing(listingData);

      Alert.alert("Success", "Game added successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/"),
        },
      ]);

      setFormData({
        name: "",
        description: "",
        price: "",
        img: "",
        contacts_nr: "",
        category: Category.GAMES,
      });
    } catch (error) {
      console.error("Error adding game:", error);
      Alert.alert("Error", "Failed to add game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="p-8">
        <View className="mb-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-8 self-start bg-slate-700 px-6 py-4 rounded-xl"
          >
            <Text className="text-white text-lg font-medium">← Back</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-bold text-white mb-4">
            Add New Game
          </Text>
          <Text className="text-slate-300 text-lg leading-relaxed">
            Add your game to the MongoDB database and share it with the
            community
          </Text>
        </View>

        <View className="bg-slate-800 rounded-2xl shadow-lg p-10 space-y-8 border border-slate-700">
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
              <View className="mt-6">
                <Text className="text-slate-300 text-base mb-3 font-medium">
                  Preview:
                </Text>
                <Image
                  source={{ uri: formData.img }}
                  className="w-full h-56 rounded-2xl"
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

          <View>
            <Text className="text-white font-semibold mb-4 text-lg">
              Category
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {Object.values(Category).map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setFormData({ ...formData, category })}
                  className={`px-6 py-4 rounded-2xl border-2 ${
                    formData.category === category
                      ? "bg-emerald-600 border-emerald-500"
                      : "bg-slate-700 border-slate-600"
                  }`}
                >
                  <Text
                    className={`capitalize text-base ${
                      formData.category === category
                        ? "text-white font-semibold"
                        : "text-slate-300 font-medium"
                    }`}
                  >
                    {category.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`py-5 px-8 rounded-xl mt-8 ${
              loading ? "bg-slate-600" : "bg-emerald-600"
            }`}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-medium ml-3 text-lg">
                  Adding Game...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-medium text-center text-lg">
                Add Game
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-8 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <Text className="text-emerald-400 font-bold mb-2 text-lg">Info</Text>
          <Text className="text-slate-300 text-base leading-relaxed">
            This game will be added directly to your MongoDB database and will
            appear on the main page immediately.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
