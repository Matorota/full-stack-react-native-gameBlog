import { useRouter } from "expo-router";

interface SafeNavigationHook {
  navigateToAddGame: () => void;
  navigateToManageGames: () => void;
  navigateToEditGame: (id: string) => void;
  canNavigate: boolean;
}

export function useSafeNavigation(): SafeNavigationHook {
  let router: any = null;
  let canNavigate = false;

  try {
    router = useRouter();
    canNavigate = !!router;
  } catch (error) {
    console.warn("Navigation context not available:", error);
    canNavigate = false;
  }

  const navigateToAddGame = () => {
    if (!canNavigate || !router) {
      console.log("Navigation not available - Add Game disabled");
      return;
    }

    try {
      router.push("/add-mongo-game");
    } catch (error) {
      console.warn("Failed to navigate to Add Game:", error);
    }
  };

  const navigateToManageGames = () => {
    if (!canNavigate || !router) {
      console.log("Navigation not available - Manage Games disabled");
      return;
    }

    try {
      router.push("/mongo-games-manager");
    } catch (error) {
      console.warn("Failed to navigate to Manage Games:", error);
    }
  };

  const navigateToEditGame = (id: string) => {
    if (!canNavigate || !router) {
      console.log("Navigation not available - Edit Game disabled");
      return;
    }

    try {
      router.push(`/edit-game/${id}`);
    } catch (error) {
      console.warn("Failed to navigate to Edit Game:", error);
    }
  };

  return {
    navigateToAddGame,
    navigateToManageGames,
    navigateToEditGame,
    canNavigate,
  };
}
