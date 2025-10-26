import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GameHubMongoService from "../services/GameHubMongoService";

export default function MongoConnectionTest() {
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const mongoService = GameHubMongoService.getInstance();
    setConnectionInfo(mongoService.getConnectionInfo());
    setConnected(mongoService.isConnected());
  }, []);

  const handleConnect = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your MongoDB password");
      return;
    }

    setLoading(true);
    try {
      const mongoService = GameHubMongoService.getInstance();
      const success = await mongoService.connect();

      if (success) {
        setConnected(true);
        setConnectionInfo(mongoService.getConnectionInfo());
        Alert.alert("Success", "Connected to MongoDB Atlas!");

        // Load existing data
        await loadListings();
      } else {
        Alert.alert("Error", "Failed to connect to MongoDB");
      }
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert("Error", `Connection failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loadListings = async () => {
    try {
      const mongoService = GameHubMongoService.getInstance();
      const data = await mongoService.getListings();
      setListings(data);
      console.log("Loaded listings:", data);
    } catch (error) {
      console.error("Error loading listings:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const mongoService = GameHubMongoService.getInstance();
      await mongoService.disconnect();
      setConnected(false);
      setListings([]);
      setConnectionInfo(mongoService.getConnectionInfo());
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const addTestGame = async () => {
    try {
      const mongoService = GameHubMongoService.getInstance();

      const testListing = {
        title: "Test Game from App",
        description: "Added via React Native app",
        price: 29.99,
        images: ["https://via.placeholder.com/300x200?text=Test+Game"],
        contact: {
          name: "Test User",
          phone: "+370 600 12345",
          email: "test@example.com",
        },
        category: "games" as any,
        platform: "PC",
        genre: "Action",
        condition: "new" as any,
      };

      const newListing = await mongoService.createListing(testListing);
      Alert.alert("Success", `Added test game: ${newListing.title}`);
      await loadListings();
    } catch (error) {
      console.error("Error adding test game:", error);
      Alert.alert("Error", `Failed to add test game: ${error}`);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      <View className="bg-gray-800 rounded-lg p-4 mb-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="server" size={24} color="#10B981" />
          <Text className="text-white text-xl font-bold ml-2">
            MongoDB Connection Test
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-300 mb-2">Connection Status:</Text>
          <View className="flex-row items-center">
            <View
              className={`w-3 h-3 rounded-full mr-2 ${connected ? "bg-green-500" : "bg-red-500"}`}
            />
            <Text
              className={`font-semibold ${connected ? "text-green-400" : "text-red-400"}`}
            >
              {connected ? "Connected" : "Disconnected"}
            </Text>
          </View>
        </View>

        {connectionInfo && (
          <View className="mb-4">
            <Text className="text-gray-300 mb-2">Connection Info:</Text>
            <Text className="text-gray-400 text-sm">
              URI: {connectionInfo.uri}
            </Text>
            <Text className="text-gray-400 text-sm">
              Database: {connectionInfo.dbName}
            </Text>
            <Text className="text-gray-400 text-sm">
              Collection: {connectionInfo.collection}
            </Text>
          </View>
        )}

        {!connected && (
          <View className="mb-4">
            <Text className="text-gray-300 mb-2">MongoDB Password:</Text>
            <TextInput
              className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your MongoDB password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>
        )}

        <View className="flex-row space-x-2">
          {!connected ? (
            <TouchableOpacity
              className={`flex-1 bg-green-600 p-3 rounded-lg ${loading ? "opacity-50" : ""}`}
              onPress={handleConnect}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-center">
                {loading ? "Connecting..." : "Connect"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                className="flex-1 bg-red-600 p-3 rounded-lg"
                onPress={handleDisconnect}
              >
                <Text className="text-white font-semibold text-center">
                  Disconnect
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 p-3 rounded-lg"
                onPress={loadListings}
              >
                <Text className="text-white font-semibold text-center">
                  Reload Data
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-purple-600 p-3 rounded-lg"
                onPress={addTestGame}
              >
                <Text className="text-white font-semibold text-center">
                  Add Test
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {connected && listings.length > 0 && (
        <View className="bg-gray-800 rounded-lg p-4">
          <Text className="text-white text-lg font-bold mb-3">
            Blog Games ({listings.length})
          </Text>
          {listings.map((listing, index) => (
            <View
              key={listing.id || index}
              className="bg-gray-700 rounded-lg p-3 mb-2"
            >
              <Text className="text-white font-semibold">{listing.title}</Text>
              <Text className="text-gray-300 text-sm">
                {listing.description}
              </Text>
              <Text className="text-green-400 font-bold">${listing.price}</Text>
              {listing.platform && (
                <Text className="text-blue-400 text-sm">
                  Platform: {listing.platform}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {connected && listings.length === 0 && (
        <View className="bg-gray-800 rounded-lg p-4">
          <Text className="text-gray-400 text-center">
            No blog games found in database
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
