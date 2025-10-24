import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GameMarketplace from "./components/GameMarketplace";
import MongoConnectionTest from "./components/MongoConnectionTest";
import { useListings } from "./contexts/ListingContext";

export default function Index() {
  const router = useRouter();
  const { listings } = useListings();
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const [showMongoMenu, setShowMongoMenu] = useState(false);

  if (showConnectionTest) {
    return (
      <View className="flex-1 bg-gray-900">
        <View className="flex-row items-center justify-between p-4 bg-gray-800">
          <TouchableOpacity
            onPress={() => setShowConnectionTest(false)}
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="#10B981" />
            <Text className="text-green-400 ml-2 font-semibold">
              Back to GameHub
            </Text>
          </TouchableOpacity>
        </View>
        <MongoConnectionTest />
      </View>
    );
  }

  const handleMongoAction = (action: string) => {
    setShowMongoMenu(false);
    switch (action) {
      case "view":
        router.push("/mongo-games-manager");
        break;
      case "add":
        router.push("/add-mongo-game");
        break;
      case "test":
        setShowConnectionTest(true);
        break;
    }
  };

  return (
    <View className="flex-1">
      {/* MongoDB Control Panel */}
      <View className="absolute top-12 right-4 z-50">
        <View className="relative">
          <TouchableOpacity
            onPress={() => setShowMongoMenu(!showMongoMenu)}
            className="bg-gray-800 p-3 rounded-full border border-gray-600 shadow-lg"
          >
            <Ionicons name="server" size={20} color="#10B981" />
          </TouchableOpacity>

          {/* MongoDB Quick Stats */}
          <View className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full min-w-6 h-6 items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {listings.length}
            </Text>
          </View>

          {/* MongoDB Menu */}
          {showMongoMenu && (
            <View className="absolute top-14 right-0 bg-gray-800 rounded-lg shadow-xl border border-gray-600 min-w-48">
              <TouchableOpacity
                onPress={() => handleMongoAction("view")}
                className="flex-row items-center px-4 py-3 border-b border-gray-600"
              >
                <Ionicons name="list" size={18} color="#10B981" />
                <Text className="text-green-400 ml-3 font-medium">
                  Manage Games ({listings.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleMongoAction("add")}
                className="flex-row items-center px-4 py-3 border-b border-gray-600"
              >
                <Ionicons name="add-circle" size={18} color="#3B82F6" />
                <Text className="text-blue-400 ml-3 font-medium">
                  Add New Game
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleMongoAction("test")}
                className="flex-row items-center px-4 py-3"
              >
                <Ionicons name="analytics" size={18} color="#F59E0B" />
                <Text className="text-yellow-400 ml-3 font-medium">
                  Connection Test
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Tap outside to close menu */}
      {showMongoMenu && (
        <TouchableOpacity
          onPress={() => setShowMongoMenu(false)}
          className="absolute inset-0 z-40"
          activeOpacity={1}
        />
      )}

      <GameMarketplace />
    </View>
  );
}
