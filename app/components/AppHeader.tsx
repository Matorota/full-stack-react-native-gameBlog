import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useListings } from "../contexts/ListingContext";
import GameHubMongoService from "../services/GameHubMongoService";
import ConnectionStatusIndicator from "./ConnectionStatusIndicator";

export default function AppHeader() {
  const router = useRouter();
  const { filteredListings, currentUser } = useListings();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const mongoService = GameHubMongoService.getInstance();
      await mongoService.connect();
      const games = await mongoService.getListings();
      Alert.alert(
        "Connection Success",
        `Successfully connected to database.\nFound ${games.length} games in collection.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Connection Failed",
        `Failed to connect to database.\nError: ${error instanceof Error ? error.message : "Unknown error"}`,
        [{ text: "OK" }]
      );
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <>
      <View className="bg-slate-800 px-6 py-5 shadow-xl border-b border-slate-600">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleSettingsPress}
            className="p-3 rounded-xl bg-slate-700/50"
          >
            <Ionicons name="menu-outline" size={22} color="#10B981" />
          </TouchableOpacity>

          <View className="flex-1 items-center mx-4">
            <Text className="text-2xl font-bold text-white tracking-wide">
              GameHub
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/add-mongo-game")}
            className="p-3 rounded-xl bg-slate-700/50"
          >
            <Ionicons name="add" size={22} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-slate-800 rounded-t-3xl p-8">
            <View className="w-12 h-1 bg-slate-600 rounded-full self-center mb-8" />

            <Text className="text-2xl font-bold text-white mb-8 text-center">
              Settings
            </Text>

            <View className="space-y-6">
              <TouchableOpacity
                onPress={() => {
                  setShowSettingsModal(false);
                  router.push("/mongo-games-manager");
                }}
                className="flex-row items-center justify-between py-6 px-8 bg-slate-700 rounded-xl shadow-sm border border-slate-600 mb-2"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-emerald-600/20 rounded-lg items-center justify-center mr-4">
                    <Ionicons
                      name="game-controller-outline"
                      size={20}
                      color="#10B981"
                    />
                  </View>
                  <Text className="text-white text-lg font-medium">
                    Manage Games
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowSettingsModal(false);
                  router.push("/add-mongo-game");
                }}
                className="flex-row items-center justify-between py-6 px-8 bg-slate-700 rounded-xl shadow-sm border border-slate-600 mb-2"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-600/20 rounded-lg items-center justify-center mr-4">
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color="#3B82F6"
                    />
                  </View>
                  <Text className="text-white text-lg font-medium">
                    Add New Game
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setShowSettingsModal(false);
                  await testConnection();
                }}
                disabled={isTestingConnection}
                className="flex-row items-center justify-between py-6 px-8 bg-slate-700 rounded-xl shadow-sm border border-slate-600 mb-2"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-yellow-600/20 rounded-lg items-center justify-center mr-4">
                    <Ionicons
                      name={isTestingConnection ? "sync" : "wifi-outline"}
                      size={20}
                      color="#F59E0B"
                    />
                  </View>
                  <Text className="text-white text-lg font-medium">
                    {isTestingConnection ? "Testing..." : "Test Connection"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="mt-12 p-8 bg-slate-900 rounded-xl border border-slate-600 shadow-sm">
              <Text className="text-slate-300 text-lg font-semibold mb-6">
                Database Status
              </Text>
              <ConnectionStatusIndicator />
            </View>

            <TouchableOpacity
              onPress={() => setShowSettingsModal(false)}
              className="mt-10 py-5 px-8 bg-slate-600 rounded-xl shadow-sm"
            >
              <Text className="text-white text-center text-lg font-medium">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
