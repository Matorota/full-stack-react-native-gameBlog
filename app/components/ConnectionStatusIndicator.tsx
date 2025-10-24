import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GameHubMongoService from "../services/GameHubMongoService";

export default function ConnectionStatusIndicator() {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [expanded, setExpanded] = useState(false);
  const [dbInfo, setDbInfo] = useState({
    database: "",
    collection: "",
    error: null as string | null,
  });

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const mongoService = GameHubMongoService.getInstance();
    const statusInfo = mongoService.getConnectionStatus();
    setStatus(statusInfo.status);
    setDbInfo({
      database: statusInfo.database,
      collection: statusInfo.collection,
      error: statusInfo.error,
    });
  };

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return "checkmark-circle";
      case "connecting":
        return "sync";
      case "error":
        return "close-circle";
      default:
        return "remove-circle";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Prisijungta";
      case "connecting":
        return "Jungiamasi...";
      case "error":
        return "Klaida";
      default:
        return "Atsijungta";
    }
  };

  return (
    <View className="bg-gray-800 border-b border-gray-700">
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="px-4 py-2 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <View className={`w-2 h-2 rounded-full ${getStatusColor()} mr-2`} />
          <Ionicons
            name={getStatusIcon()}
            size={16}
            color={status === "connected" ? "#10B981" : "#EF4444"}
          />
          <Text className="text-white text-sm ml-2">{getStatusText()}</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {expanded && (
        <View className="px-4 py-3 bg-gray-900">
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="server" size={14} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs ml-2">Duomenų bazė:</Text>
              <Text className="text-green-400 text-xs ml-2 font-semibold">
                {dbInfo.database}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="albums" size={14} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs ml-2">Kolekcija:</Text>
              <Text className="text-green-400 text-xs ml-2 font-semibold">
                {dbInfo.collection}
              </Text>
            </View>
            {dbInfo.error && (
              <View className="flex-row items-center mt-2 bg-red-900/20 p-2 rounded">
                <Ionicons name="warning" size={14} color="#EF4444" />
                <Text className="text-red-400 text-xs ml-2 flex-1">
                  {dbInfo.error}
                </Text>
              </View>
            )}
            {status === "connected" && (
              <View className="mt-2 bg-green-900/20 p-2 rounded">
                <Text className="text-green-400 text-xs">
                  ✅ Visi duomenys saugomi ir sinchronizuojami
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
