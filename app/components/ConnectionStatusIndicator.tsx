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
    <View className="bg-slate-700 rounded-xl border border-slate-600">
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="px-5 py-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <View className={`w-4 h-4 rounded-full ${getStatusColor()} mr-4`} />
          <Text className="text-white text-base font-medium">
            {getStatusText()}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {expanded && (
        <View className="px-5 pb-5 space-y-4 border-t border-slate-600 pt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-400 text-sm">Database:</Text>
            <Text className="text-emerald-400 text-sm font-medium">
              {dbInfo.database}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-400 text-sm">Collection:</Text>
            <Text className="text-emerald-400 text-sm font-medium">
              {dbInfo.collection}
            </Text>
          </View>
          {dbInfo.error && (
            <View className="bg-red-900/20 p-3 rounded-lg border border-red-800">
              <Text className="text-red-400 text-sm">{dbInfo.error}</Text>
            </View>
          )}
          {status === "connected" && (
            <View className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-800">
              <Text className="text-emerald-400 text-sm">
                All data is stored and synchronized
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
