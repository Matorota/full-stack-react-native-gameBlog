import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useListingContext } from "./contexts/ListingContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useListingContext();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const success = await login({ email: email.trim(), password });

      if (success) {
        router.replace("/home");
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 justify-center px-8">
        {/* Header */}
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white text-center mb-3">
            Sign In
          </Text>
          <Text className="text-slate-400 text-center text-lg">
            Welcome back to GameHub
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-3">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-slate-800 text-white py-5 px-5 rounded-xl text-lg border border-slate-700"
            />
          </View>

          <View className="mb-6">
            <Text className="text-white text-base font-medium mb-3">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#64748b"
              secureTextEntry
              className="bg-slate-800 text-white py-5 px-5 rounded-xl text-lg border border-slate-700"
            />
          </View>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className={`py-5 rounded-xl mb-6 ${
            loading ? "bg-slate-600" : "bg-emerald-500 active:bg-emerald-600"
          }`}
        >
          <Text className="text-white text-xl font-semibold text-center">
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </Pressable>

        {/* Links */}
        <View className="items-center">
          <View className="flex-row justify-center mb-4">
            <Text className="text-slate-400 text-base">
              Don't have an account?{" "}
            </Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text className="text-emerald-400 font-semibold text-base">
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>

          <Link href="/home" asChild>
            <Pressable className="py-2">
              <Text className="text-slate-500 text-base">
                Continue as Guest
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
