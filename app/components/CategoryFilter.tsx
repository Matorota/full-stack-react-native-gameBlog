import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../types";

interface CategoryFilterProps {
  selectedCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
}

interface CategoryItem {
  key: Category | "all";
  label: string;
  icon: string;
}

const CATEGORIES: CategoryItem[] = [
  { key: "all", label: "All", icon: "apps" },
  { key: Category.GAMES, label: "Games", icon: "game-controller" },
  { key: Category.CONSOLES, label: "Consoles", icon: "tv" },
  { key: Category.ACCESSORIES, label: "Accessories", icon: "headset" },
  {
    key: Category.PC_COMPONENTS,
    label: "Pc Components",
    icon: "hardware-chip",
  },
  { key: Category.MERCHANDISE, label: "Merchandise", icon: "shirt" },
  { key: Category.COLLECTIBLES, label: "Collectibles", icon: "trophy" },
  { key: Category.DIGITAL, label: "Digital", icon: "cloud-download" },
  { key: Category.OTHER, label: "Other", icon: "ellipsis-horizontal" },
];

interface CategoryButtonProps {
  category: CategoryItem;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryButton({
  category,
  isSelected,
  onPress,
}: CategoryButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    // Use a simple timeout to ensure we're not in any navigation context
    setTimeout(() => {
      try {
        console.log(`Category filter pressed: ${category.label}`);
        onPress();
      } catch (error) {
        console.warn("Category filter error:", error);
      }
    }, 10);
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
  };

  return (
    <View
      className={`mx-1 px-5 py-2.5 rounded-full ${
        isSelected
          ? "bg-emerald-500 shadow-lg shadow-emerald-500/25"
          : "bg-slate-700 border border-slate-600"
      }`}
      style={{
        opacity: isPressed ? 0.7 : 1,
        shadowColor: isSelected ? "#10B981" : "transparent",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.3 : 0,
        shadowRadius: 4,
        elevation: isSelected ? 4 : 0,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={category.icon as any}
          size={18}
          color={isSelected ? "white" : "#94a3b8"}
        />
        <Text
          className={`ml-2 text-sm font-semibold ${
            isSelected ? "text-white" : "text-slate-300"
          }`}
        >
          {category.label}
        </Text>
      </View>
    </View>
  );
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const handleCategoryPress = (category: Category | "all") => {
    // Direct state update without any navigation dependencies
    onCategoryChange(category);
  };

  return (
    <View className="bg-slate-800 px-4 py-6 border-b border-slate-600">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 4 }}
      >
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.key}
            category={category}
            isSelected={selectedCategory === category.key}
            onPress={() => handleCategoryPress(category.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
