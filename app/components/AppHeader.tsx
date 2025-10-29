import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useListingContext } from "../contexts/ListingContext";
import GameHubMongoService from "../services/GameHubMongoService";
import ConnectionStatusIndicator from "./ConnectionStatusIndicator";

interface AppHeaderProps {
  onManageGames?: () => void;
  onAddGames?: () => void;
}

export default function AppHeader({
  onManageGames,
  onAddGames,
}: AppHeaderProps = {}) {
  const { filteredListings, currentUser, isAuthenticated, logout } =
    useListingContext();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const router = useRouter();

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
            {isAuthenticated && currentUser && (
              <Text className="text-xs text-emerald-400 mt-1">
                Welcome, {currentUser.name}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => onAddGames && onAddGames()}
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
              {/* Authentication Section */}
              {isAuthenticated && currentUser ? (
                <>
                  <View className="py-4 px-6 bg-slate-700/50 rounded-xl border border-emerald-500/20">
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 bg-emerald-600 rounded-full items-center justify-center mr-3">
                        <Text className="text-white text-sm font-bold">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-white text-lg font-medium">
                          {currentUser.name} {currentUser.surname}
                        </Text>
                        <Text className="text-slate-300 text-sm">
                          {currentUser.email}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setShowSettingsModal(false);
                      router.push("/settings");
                    }}
                    className="flex-row items-center justify-between py-6 px-8 bg-slate-700 rounded-xl shadow-sm border border-slate-600 mb-2"
                  >
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-purple-600/20 rounded-lg items-center justify-center mr-4">
                        <Ionicons
                          name="settings-outline"
                          size={20}
                          color="#A855F7"
                        />
                      </View>
                      <Text className="text-white text-lg font-medium">
                        Account Settings
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Logout",
                        "Are you sure you want to logout?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Logout",
                            style: "destructive",
                            onPress: () => {
                              logout();
                              setShowSettingsModal(false);
                              router.push("/welcome");
                            },
                          },
                        ]
                      );
                    }}
                    className="flex-row items-center justify-between py-6 px-8 bg-red-600/10 border border-red-600/30 rounded-xl shadow-sm mb-2"
                  >
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-red-600/20 rounded-lg items-center justify-center mr-4">
                        <Ionicons
                          name="log-out-outline"
                          size={20}
                          color="#DC2626"
                        />
                      </View>
                      <Text className="text-red-400 text-lg font-medium">
                        Logout
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#DC2626"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setShowSettingsModal(false);
                    router.push("/login");
                  }}
                  className="flex-row items-center justify-between py-6 px-8 bg-emerald-600/10 border border-emerald-600/30 rounded-xl shadow-sm mb-2"
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-emerald-600/20 rounded-lg items-center justify-center mr-4">
                      <Ionicons
                        name="log-in-outline"
                        size={20}
                        color="#10B981"
                      />
                    </View>
                    <Text className="text-emerald-400 text-lg font-medium">
                      Sign In
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#10B981" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setShowSettingsModal(false);
                  console.log("Manage Games pressed");
                  onManageGames && onManageGames();
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
                  console.log("Add Game pressed");
                  onAddGames && onAddGames();
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
