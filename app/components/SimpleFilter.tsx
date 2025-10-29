import React from "react";
import { View, Text, Pressable } from "react-native";
import { Category } from "../types";

interface SimpleFilterProps {
  selectedCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: Category.GAMES, label: "Games" },
  { key: Category.CONSOLES, label: "Consoles" },
  { key: Category.ACCESSORIES, label: "Accessories" },
  { key: Category.PC_COMPONENTS, label: "PC Components" },
];

export default function SimpleFilter({
  selectedCategory,
  onCategoryChange,
}: SimpleFilterProps) {
  return (
    <View className="bg-slate-800 px-4 py-4 border-b border-slate-600">
      <View className="flex-row flex-wrap justify-center">
        {CATEGORIES.map((category) => (
          <Pressable
            key={category.key}
            className={`mx-1 mb-2 px-4 py-2 rounded-lg ${
              selectedCategory === category.key
                ? "bg-emerald-500"
                : "bg-slate-700"
            }`}
            onPress={() => onCategoryChange(category.key as Category | "all")}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedCategory === category.key
                  ? "text-white"
                  : "text-slate-300"
              }`}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
