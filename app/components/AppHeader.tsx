import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useListings } from "../contexts/ListingContext";

export default function AppHeader() {
  const router = useRouter();
  const { filteredListings, currentUser } = useListings();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
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
          <View className="bg-slate-800 rounded-t-3xl p-8 max-h-[80%]">
            <View className="w-16 h-1 bg-slate-600 rounded-full self-center mb-8" />

            <Text className="text-2xl font-bold text-white mb-8 text-center">
              Settings
            </Text>

            <View className="space-y-6">
              <TouchableOpacity
                onPress={() => {
                  setShowSettingsModal(false);
                  router.push("/mongo-games-manager");
                }}
                className="flex-row items-center p-5 bg-slate-700/50 rounded-2xl"
              >
                <Ionicons
                  name="game-controller-outline"
                  size={24}
                  color="#10B981"
                />
                <Text className="text-white text-lg ml-4 font-medium">
                  Manage Games
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#64748B"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                className="mt-6 p-4 bg-slate-600/50 rounded-2xl"
              >
                <Text className="text-white text-center text-lg font-medium">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
