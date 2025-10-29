import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useListingContext } from "./contexts/ListingContext";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useListingContext();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const success = await register({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password,
      });

      if (success) {
        router.replace("/home");
      } else {
        Alert.alert(
          "Error",
          "Registration failed. Email may already be registered."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-white text-center mb-3">
              Create Account
            </Text>
            <Text className="text-slate-400 text-center text-lg">
              Join GameHub today
            </Text>
          </View>

          {/* Form */}
          <View className="mb-8">
            <View className="mb-6">
              <Text className="text-white text-base font-medium mb-3">
                First Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your first name"
                placeholderTextColor="#64748b"
                className="bg-slate-800 text-white py-5 px-5 rounded-xl text-lg border border-slate-700"
              />
            </View>

            <View className="mb-6">
              <Text className="text-white text-base font-medium mb-3">
                Last Name
              </Text>
              <TextInput
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter your last name"
                placeholderTextColor="#64748b"
                className="bg-slate-800 text-white py-5 px-5 rounded-xl text-lg border border-slate-700"
              />
            </View>

            <View className="mb-6">
              <Text className="text-white text-base font-medium mb-3">
                Email
              </Text>
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
                placeholder="Enter your password (min 6 characters)"
                placeholderTextColor="#64748b"
                secureTextEntry
                className="bg-slate-800 text-white py-5 px-5 rounded-xl text-lg border border-slate-700"
              />
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
            disabled={loading}
            className={`py-5 rounded-xl mb-6 ${
              loading ? "bg-slate-600" : "bg-emerald-500 active:bg-emerald-600"
            }`}
          >
            <Text className="text-white text-xl font-semibold text-center">
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </Pressable>

          <View className="items-center">
            <View className="flex-row justify-center mb-4">
              <Text className="text-slate-400 text-base">
                Already have an account?{" "}
              </Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="text-emerald-400 font-semibold text-base">
                    Sign In
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
      </ScrollView>
    </SafeAreaView>
  );
}
