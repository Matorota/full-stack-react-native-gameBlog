import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 px-8">
        {/* Header Section */}
        <View className="flex-1 justify-center items-center">
          <View className="mb-16">
            <Text className="text-5xl font-bold text-white text-center mb-6">
              GameHub
            </Text>
            <Text className="text-xl text-slate-300 text-center leading-relaxed">
              Welcome to your gaming marketplace
            </Text>
            <Text className="text-lg text-slate-400 text-center mt-4">
              Buy, sell, and discover games
            </Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View className="pb-12">
          <View className="mb-6">
            <Link href="/login" asChild>
              <Pressable className="bg-white py-5 rounded-lg mb-4">
                <Text className="text-slate-900 text-xl font-semibold text-center">
                  Sign In
                </Text>
              </Pressable>
            </Link>

            <Link href="/register" asChild>
              <Pressable className="bg-slate-800 border border-slate-600 py-5 rounded-lg mb-4">
                <Text className="text-white text-xl font-semibold text-center">
                  Create Account
                </Text>
              </Pressable>
            </Link>

            <Link href="/home" asChild>
              <Pressable className="py-4">
                <Text className="text-slate-400 text-lg text-center underline">
                  Continue as Guest
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
