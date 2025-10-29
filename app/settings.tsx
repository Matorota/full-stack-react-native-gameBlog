import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password change logic
      Alert.alert("Success", "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/welcome"),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Settings</Text>
          <View className="w-8" />
        </View>

        {/* Account Section - Compact */}
        <View className="mb-6">
          <Text className="text-white text-base font-semibold mb-3">
            Account
          </Text>
          <View className="bg-slate-800 rounded-lg p-3 mb-4">
            <View className="flex-row items-center">
              <Ionicons name="person-circle" size={20} color="#10b981" />
              <Text className="text-white text-sm ml-3">Profile Settings</Text>
            </View>
          </View>
        </View>

        {/* Change Password Section - Compact */}
        <View className="mb-6">
          <Text className="text-white text-base font-semibold mb-3">
            Security
          </Text>

          <View className="mb-3">
            <Text className="text-white text-sm mb-2">Current Password</Text>
            <TextInput
              className="bg-slate-800 text-white py-3 px-3 rounded-lg text-sm border border-slate-700"
              placeholder="Enter current password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          <View className="mb-3">
            <Text className="text-white text-sm mb-2">New Password</Text>
            <TextInput
              className="bg-slate-800 text-white py-3 px-3 rounded-lg text-sm border border-slate-700"
              placeholder="Enter new password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View className="mb-4">
            <Text className="text-white text-sm mb-2">
              Confirm New Password
            </Text>
            <TextInput
              className="bg-slate-800 text-white py-3 px-3 rounded-lg text-sm border border-slate-700"
              placeholder="Confirm new password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={loading}
            className="bg-emerald-500 py-3 rounded-lg mb-4"
          >
            <Text className="text-white text-sm font-semibold text-center">
              {loading ? "Changing..." : "Change Password"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View className="mb-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 py-4 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out" size={18} color="white" />
              <Text className="text-white text-base font-semibold ml-2">
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <Text className="text-slate-500 text-center text-xs mt-4">
          GameHub v1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}
