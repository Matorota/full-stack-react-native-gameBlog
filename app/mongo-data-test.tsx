import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import GameHubMongoService from "./services/GameHubMongoService";
import { Listing } from "./types";

export default function MongoDataTest() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [games, setGames] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const mongoService = GameHubMongoService.getInstance();

      const isConnected = await mongoService.connect();

      setConnected(isConnected);

      if (isConnected) {
        console.log("Connected to backend");

        const listings = await mongoService.getListings();
        setGames(listings);

        console.log(`Found ${listings.length} games from backend`);
      } else {
        setError("Failed to connect to backend");
      }
    } catch (err) {
      console.error("Backend error:", err);
      setError(`Error: ${err}`);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        MongoDB Data Test
      </Text>

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
            <Text className="text-white font-semibold ml-2">Testing...</Text>
          </View>
        ) : (
          <Text className="text-white font-semibold text-center">
            Test Backend Connection
          </Text>
        )}
      </TouchableOpacity>

      <View className="bg-white rounded-lg p-4 mb-6">
        <Text className="text-lg font-semibold mb-2">Connection Status:</Text>
        <Text
          className={`text-lg ${connected ? "text-green-600" : "text-red-600"}`}
        >
          {connected ? "Connected" : "Not Connected"}
        </Text>
        {error && <Text className="text-red-600 mt-2 text-sm">{error}</Text>}
      </View>

      {games.length > 0 && (
        <View className="bg-white rounded-lg p-4">
          <Text className="text-lg font-semibold mb-4">
            Games from MongoDB ({games.length} items):
          </Text>

          {games.map((game, index) => (
            <View key={index} className="border-b border-gray-200 pb-4 mb-4">
              <Text className="font-semibold text-gray-800">{game.title}</Text>
              <Text className="text-gray-600 text-sm mt-1">
                {game.description}
              </Text>
              <Text className="text-green-600 font-semibold mt-1">
                {game.price} EUR
              </Text>
              <Text className="text-blue-600 text-sm mt-1">
                {game.contact.phone}
              </Text>
              {game.platform && (
                <Text className="text-purple-600 text-sm mt-1">
                  {game.platform}
                </Text>
              )}
              {game.images[0] && (
                <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                  {game.images[0]}
                </Text>
              )}
              <Text className="text-gray-400 text-xs mt-1">ID: {game.id}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="bg-yellow-50 rounded-lg p-4 mt-6">
        <Text className="text-yellow-800 font-semibold mb-2">
          Instructions:
        </Text>
        <Text className="text-yellow-700 text-sm">
          1. Make sure the backend server is running (cd backend && npm start)
          {"\n"}
          2. Check that MongoDB Atlas Network Access is configured
          {"\n"}
          3. If you see games, everything is working correctly!
        </Text>
      </View>
    </ScrollView>
  );
}
