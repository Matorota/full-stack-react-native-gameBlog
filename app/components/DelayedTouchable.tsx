import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DelayedTouchableProps {
  onPress?: () => void;
  className?: string;
  style?: any;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function DelayedTouchable({
  onPress,
  className,
  style,
  children,
  disabled = false,
}: DelayedTouchableProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for navigation context to be ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const handlePress = () => {
    if (!isReady || disabled) {
      console.log("Touch disabled - waiting for navigation context");
      return;
    }

    try {
      if (onPress) {
        onPress();
      }
    } catch (error) {
      console.warn("Press error:", error);
    }
  };

  if (!isReady) {
    // During the delay, render as a non-interactive View
    return (
      <View className={className} style={style}>
        {children}
      </View>
    );
  }

  // After delay, render as TouchableOpacity
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
}
