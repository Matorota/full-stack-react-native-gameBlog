import React, { useState } from "react";
import { View, Text, GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SimpleButtonProps {
  onPress?: () => void;
  className?: string;
  style?: any;
  children?: React.ReactNode;
  disabled?: boolean;
  isSelected?: boolean;
  categoryKey?: string;
  categoryLabel?: string;
  categoryIcon?: string;
}

export default function SimpleButton({
  onPress,
  className,
  style,
  children,
  disabled = false,
  isSelected = false,
  categoryKey,
  categoryLabel,
  categoryIcon,
}: SimpleButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = (event: GestureResponderEvent) => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (!disabled && isPressed) {
      setIsPressed(false);
      // Use setTimeout to avoid any potential navigation context issues
      setTimeout(() => {
        try {
          if (onPress) {
            console.log(`Filter pressed: ${categoryLabel || "Unknown"}`);
            onPress();
          }
        } catch (error) {
          console.warn("Button press error:", error);
        }
      }, 0);
    }
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
  };

  return (
    <View
      className={className}
      style={[
        style,
        {
          opacity: isPressed ? 0.7 : 1,
        },
      ]}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {children || (
        <View className="flex-row items-center">
          {categoryIcon && (
            <Ionicons
              name={categoryIcon as any}
              size={18}
              color={isSelected ? "white" : "#94a3b8"}
            />
          )}
          {categoryLabel && (
            <Text
              className={`ml-2 text-sm font-semibold ${
                isSelected ? "text-white" : "text-slate-300"
              }`}
            >
              {categoryLabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
