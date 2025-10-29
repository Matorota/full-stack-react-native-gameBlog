import { useRouter } from "expo-router";

export const useAppNavigation = () => {
  const router = useRouter();

  const navigateToAuth = {
    welcome: () => router.push("/welcome"),
    login: () => router.push("/login"),
    register: () => router.push("/register"),
  };

  const navigateToMain = {
    home: () => router.push("/home"),
    settings: () => router.push("/settings"),
    testConnection: () => router.push("/test-connection"),
  };

  const navigateToAdmin = {
    manageGames: () => router.push("/mongo-games-manager"),
    addGame: () => router.push("/add-mongo-game"),
    editGame: (id: string) => router.push(`/edit-game/${id}`),
  };

  const goBack = () => router.back();
  const replace = (route: Parameters<typeof router.replace>[0]) =>
    router.replace(route);

  return {
    navigateToAuth,
    navigateToMain,
    navigateToAdmin,
    goBack,
    replace,
  };
};

export const NavigationRoutes = {
  // Auth routes
  WELCOME: "/welcome",
  LOGIN: "/login",
  REGISTER: "/register",

  // Main routes
  HOME: "/home",
  SETTINGS: "/settings",
  TEST_CONNECTION: "/test-connection",

  // Admin routes
  MANAGE_GAMES: "/mongo-games-manager",
  ADD_GAME: "/add-mongo-game",
  EDIT_GAME: (id: string) => `/edit-game/${id}`,
} as const;
