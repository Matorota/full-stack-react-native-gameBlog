import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TestConnection() {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "testing" | "connected" | "failed"
  >("idle");
  const [lastTestTime, setLastTestTime] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const testDatabaseConnection = async () => {
    setConnectionStatus("testing");
    setErrorMessage(null);

    try {
      // Get the API base URL from environment
      const apiBaseUrl =
        process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

      const response = await fetch(`${apiBaseUrl}/health`);

      if (response.ok) {
        const data = await response.json();
        setConnectionStatus("connected");
        setLastTestTime(new Date().toLocaleString());
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("failed");
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      setLastTestTime(new Date().toLocaleString());
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#10b981"; // emerald-500
      case "failed":
        return "#ef4444"; // red-500
      case "testing":
        return "#f59e0b"; // amber-500
      default:
        return "#64748b"; // slate-500
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "failed":
        return "Connection Failed";
      case "testing":
        return "Testing...";
      default:
        return "Not Tested";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return "checkmark-circle";
      case "failed":
        return "close-circle";
      case "testing":
        return "time";
      default:
        return "help-circle";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Test Connection</Text>
          <View className="w-8" />
        </View>

        {/* Connection Status Card */}
        <View className="bg-slate-800 rounded-lg p-6 mb-6">
          <View className="items-center mb-6">
            <View className="mb-4">
              {connectionStatus === "testing" ? (
                <ActivityIndicator size="large" color={getStatusColor()} />
              ) : (
                <Ionicons
                  name={getStatusIcon() as any}
                  size={64}
                  color={getStatusColor()}
                />
              )}
            </View>
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: getStatusColor() }}
            >
              {getStatusText()}
            </Text>
            {lastTestTime && (
              <Text className="text-slate-400 text-sm">
                Last tested: {lastTestTime}
              </Text>
            )}
          </View>

          {errorMessage && (
            <View className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4">
              <View className="flex-row items-start">
                <Ionicons name="warning" size={20} color="#ef4444" />
                <View className="flex-1 ml-3">
                  <Text className="text-red-400 font-medium mb-1">
                    Error Details:
                  </Text>
                  <Text className="text-red-300 text-sm">{errorMessage}</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={testDatabaseConnection}
            disabled={connectionStatus === "testing"}
            className={`py-4 rounded-lg ${
              connectionStatus === "testing" ? "bg-slate-600" : "bg-blue-600"
            }`}
          >
            <View className="flex-row items-center justify-center">
              {connectionStatus === "testing" ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="mr-2"
                />
              ) : (
                <Ionicons name="refresh" size={18} color="white" />
              )}
              <Text className="text-white text-base font-semibold ml-2">
                {connectionStatus === "testing"
                  ? "Testing Connection..."
                  : "Test Connection"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Connection Info */}
        <View className="bg-slate-800 rounded-lg p-4">
          <Text className="text-white text-base font-semibold mb-3">
            Connection Details
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="server" size={16} color="#64748b" />
              <Text className="text-slate-300 text-sm ml-2">
                API Endpoint:{" "}
                {process.env.EXPO_PUBLIC_API_BASE_URL ||
                  "http://localhost:3000/api"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="cloud" size={16} color="#64748b" />
              <Text className="text-slate-300 text-sm ml-2">
                Database: MongoDB Atlas (blogGames)
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={16} color="#64748b" />
              <Text className="text-slate-300 text-sm ml-2">
                Test checks API health and database connectivity
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
