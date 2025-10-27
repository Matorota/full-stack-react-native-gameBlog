import React, { useState } from "react";
import { View, ViewStyle, GestureResponderEvent } from "react-native";

interface SafeTouchableOpacityProps {
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function SafeTouchableOpacity({
  onPress,
  className,
  style,
  children,
  disabled = false,
}: SafeTouchableOpacityProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (!disabled && isPressed) {
      setIsPressed(false);
      setTimeout(() => {
        try {
          if (onPress) {
            onPress();
          }
        } catch (error) {
          console.warn("Press error:", error);
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
      {children}
    </View>
  );
}
