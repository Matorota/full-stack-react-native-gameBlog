import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
} from "react-native-reanimated";

interface GameEmptyStateProps {
  onAddListing: () => void;
}

export default function GameEmptyState({ onAddListing }: GameEmptyStateProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withSpring(-10, { duration: 2000 }),
        withSpring(0, { duration: 2000 })
      ),
      -1
    );

    scale.value = withRepeat(
      withSequence(
        withSpring(1.05, { duration: 3000 }),
        withSpring(1, { duration: 3000 })
      ),
      -1
    );
  }, []);

  const handleActionPress = () => {
    buttonScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );

    setTimeout(onAddListing, 150);
  };

  return (
    <View className="flex-1 justify-center items-center px-8 py-20">
      <Animated.View style={iconStyle} className="mb-6">
        <View className="w-24 h-24 bg-gray-700 rounded-full items-center justify-center relative">
          <Ionicons name="game-controller" size={48} color="#10B981" />

          <View className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <View className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300" />
        </View>
      </Animated.View>

      {/* Title */}
      <Text className="text-2xl font-bold text-white text-center mb-3">
        Pradėk savo žaidimų kolekciją!
      </Text>

      {/* Description */}
      <Text className="text-gray-400 text-center text-base leading-6 mb-8">
        Čia neradai ko ieškoji? Būk pirmasis ir sukurk savo žaidimo skelbimą!
      </Text>

      {/* Action Button */}
      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          onPress={handleActionPress}
          className="bg-green-500 px-8 py-4 rounded-xl flex-row items-center shadow-lg"
          activeOpacity={0.9}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text className="text-white font-semibold ml-2 text-base">
            Sukurti skelbimą
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Gaming-themed decorative elements */}
      <View className="absolute top-10 left-10 opacity-20">
        <Ionicons name="game-controller-outline" size={30} color="#10B981" />
      </View>
      <View className="absolute bottom-20 right-10 opacity-20">
        <Ionicons name="tv-outline" size={25} color="#3B82F6" />
      </View>
      <View className="absolute top-1/3 right-5 opacity-20">
        <Ionicons name="headset-outline" size={20} color="#8B5CF6" />
      </View>
    </View>
  );
}
