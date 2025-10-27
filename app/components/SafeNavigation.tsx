import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

interface SafeNavigationProps {
  children: (navigationHandlers: {
    handleAddListing: () => void;
    handleManageGames: () => void;
    handleEditGame: (id: string) => void;
  }) => React.ReactNode;
}

export default function SafeNavigation({ children }: SafeNavigationProps) {
  const [isReady, setIsReady] = useState(false);
  const [router, setRouter] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initNavigation = () => {
      try {
        const routerInstance = useRouter();
        if (mounted) {
          setRouter(routerInstance);
          setIsReady(true);
        }
      } catch (error) {
        console.warn("Navigation not ready, retrying...", error);
        if (mounted) {
          setTimeout(initNavigation, 100);
        }
      }
    };

    // Start initialization after a small delay
    setTimeout(initNavigation, 50);

    return () => {
      mounted = false;
    };
  }, []);

  const handleAddListing = () => {
    if (router && isReady) {
      try {
        router.push("/add-mongo-game");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  const handleManageGames = () => {
    if (router && isReady) {
      try {
        router.push("/mongo-games-manager");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  const handleEditGame = (id: string) => {
    if (router && isReady) {
      try {
        router.push(`/edit-game/${id}`);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  if (!isReady) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-slate-400">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      {children({
        handleAddListing,
        handleManageGames,
        handleEditGame,
      })}
    </>
  );
}
