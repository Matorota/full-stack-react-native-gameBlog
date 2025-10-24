import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import GameHubMongoService from "./services/GameHubMongoService";
import { BlogGame } from "./types";

export default function MongoDataTest() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [blogGames, setBlogGames] = useState<BlogGame[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const mongoService = GameHubMongoService.getInstance();

      // Connect to MongoDB Atlas Data API
      const isConnected = await mongoService.connect();

      setConnected(isConnected);

      if (isConnected) {
        console.log("✅ Prisijungta prie MongoDB");

        // Gauti duomenis iš MongoDB
        const listings = await mongoService.getListings();

        // Konvertuoti atgal į BlogGame formatą peržiūrai
        const rawData = await fetch(
          "https://data.mongodb-api.com/app/data-v1/endpoint/data/v1/action/find",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": "Nb8F0gvq4v2Q7TfY", // Reikės pakeisti
            },
            body: JSON.stringify({
              dataSource: "Cluster0",
              database: "blogGames",
              collection: "blogGames",
            }),
          }
        );

        if (rawData.ok) {
          const result = await rawData.json();
          const documents = result.documents || [];

          // Convert MongoDB ObjectId format to BlogGame format
          const convertedGames: BlogGame[] = documents.map((doc: any) => ({
            ...doc,
            _id: doc._id?.$oid || doc._id, // Convert ObjectId format
          }));

          setBlogGames(convertedGames);
        }

        console.log(`📊 Gauta ${listings.length} žaidimų iš MongoDB`);
      } else {
        setError("Nepavyko prisijungti prie MongoDB");
      }
    } catch (err) {
      console.error("❌ MongoDB klaida:", err);
      setError(`Klaida: ${err}`);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        MongoDB Duomenų Testas
      </Text>

      {/* Connection Test Button */}
      <TouchableOpacity
        onPress={testConnection}
        disabled={loading}
        className={`py-4 px-6 rounded-lg mb-6 ${
          loading ? "bg-gray-400" : "bg-blue-500"
        }`}
      >
        {loading ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white font-semibold ml-2">Testuojama...</Text>
          </View>
        ) : (
          <Text className="text-white font-semibold text-center">
            Testuoti MongoDB Prisijungimą
          </Text>
        )}
      </TouchableOpacity>

      {/* Connection Status */}
      <View className="bg-white rounded-lg p-4 mb-6">
        <Text className="text-lg font-semibold mb-2">
          Prisijungimo Statusas:
        </Text>
        <Text
          className={`text-lg ${connected ? "text-green-600" : "text-red-600"}`}
        >
          {connected ? "✅ Prisijungta" : "❌ Neprisijungta"}
        </Text>
        {error && <Text className="text-red-600 mt-2 text-sm">{error}</Text>}
      </View>

      {/* Raw MongoDB Data */}
      {blogGames.length > 0 && (
        <View className="bg-white rounded-lg p-4">
          <Text className="text-lg font-semibold mb-4">
            Tikri MongoDB Duomenys ({blogGames.length} įrašai):
          </Text>

          {blogGames.map((game, index) => (
            <View key={index} className="border-b border-gray-200 pb-4 mb-4">
              <Text className="font-semibold text-gray-800">
                🎮 {game.name}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                📝 {game.description}
              </Text>
              <Text className="text-green-600 font-semibold mt-1">
                💰 {game.price}€
              </Text>
              <Text className="text-blue-600 text-sm mt-1">
                📞 {game.contacts_nr}
              </Text>
              {game.filter && (
                <Text className="text-purple-600 text-sm mt-1">
                  🏷️ {game.filter}
                </Text>
              )}
              {game.img && (
                <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                  🖼️ {game.img}
                </Text>
              )}
              <Text className="text-gray-400 text-xs mt-1">ID: {game._id}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Instructions */}
      <View className="bg-yellow-50 rounded-lg p-4 mt-6">
        <Text className="text-yellow-800 font-semibold mb-2">
          ⚠️ Instrukcijos:
        </Text>
        <Text className="text-yellow-700 text-sm">
          1. Pakeiskite "YOUR_PASSWORD_HERE" į tikrą MongoDB Atlas API raktą
          {"\n"}
          2. Patikrinkite kad duomenų bazės pavadinimas yra "blogGames"{"\n"}
          3. Patikrinkite kad kolekcijos pavadinimas yra "blogGames"{"\n"}
          4. Jei matote duomenis, vadinasi viskas veikia teisingai!
        </Text>
      </View>
    </ScrollView>
  );
}
