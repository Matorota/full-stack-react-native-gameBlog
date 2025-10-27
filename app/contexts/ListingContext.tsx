import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Listing,
  Category,
  User,
  ListingContextType,
  BlogGame,
  blogGameToListing,
  listingToBlogGame,
} from "../types";
import GameHubMongoService from "../services/GameHubMongoService";

const ListingContext = createContext<ListingContextType | undefined>(undefined);

interface State {
  listings: Listing[];
  filteredListings: Listing[];
  selectedCategory: Category | "all";
  searchQuery: string;
  currentUser: User | null;
  rememberMe: boolean;
}

type Action =
  | { type: "SET_LISTINGS"; payload: Listing[] }
  | { type: "ADD_LISTING"; payload: Listing }
  | {
      type: "UPDATE_LISTING";
      payload: { id: string; updates: Partial<Listing> };
    }
  | { type: "DELETE_LISTING"; payload: string }
  | { type: "SET_CATEGORY"; payload: Category | "all" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_FILTERED_LISTINGS"; payload: Listing[] }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_REMEMBER_ME"; payload: boolean };

const initialState: State = {
  listings: [],
  filteredListings: [],
  selectedCategory: "all",
  searchQuery: "",
  currentUser: null,
  rememberMe: false,
};

// Reducer
function listingReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LISTINGS":
      return {
        ...state,
        listings: action.payload,
        filteredListings: filterListings(
          action.payload,
          state.selectedCategory,
          state.searchQuery
        ),
      };
    case "ADD_LISTING":
      const newListings = [...state.listings, action.payload];
      return {
        ...state,
        listings: newListings,
        filteredListings: filterListings(
          newListings,
          state.selectedCategory,
          state.searchQuery
        ),
      };
    case "UPDATE_LISTING":
      const updatedListings = state.listings.map((listing) =>
        listing.id === action.payload.id
          ? { ...listing, ...action.payload.updates, updatedAt: new Date() }
          : listing
      );
      return {
        ...state,
        listings: updatedListings,
        filteredListings: filterListings(
          updatedListings,
          state.selectedCategory,
          state.searchQuery
        ),
      };
    case "DELETE_LISTING":
      const filteredOutListings = state.listings.filter(
        (listing) => listing.id !== action.payload
      );
      return {
        ...state,
        listings: filteredOutListings,
        filteredListings: filterListings(
          filteredOutListings,
          state.selectedCategory,
          state.searchQuery
        ),
      };
    case "SET_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
        filteredListings: filterListings(
          state.listings,
          action.payload,
          state.searchQuery
        ),
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredListings: filterListings(
          state.listings,
          state.selectedCategory,
          action.payload
        ),
      };
    case "SET_FILTERED_LISTINGS":
      return {
        ...state,
        filteredListings: action.payload,
      };
    case "SET_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    case "SET_REMEMBER_ME":
      return {
        ...state,
        rememberMe: action.payload,
      };
    default:
      return state;
  }
}

function filterListings(
  listings: Listing[],
  category: Category | "all",
  searchQuery: string
): Listing[] {
  let filtered = listings;

  if (category !== "all") {
    filtered = filtered.filter((listing) => listing.category === category);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (listing) =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.price.toString().includes(query) ||
        listing.platform?.toLowerCase().includes(query) ||
        listing.genre?.toLowerCase().includes(query) ||
        listing.condition?.toLowerCase().includes(query)
    );
  }

  return filtered;
}

interface ListingProviderProps {
  children: ReactNode;
}

export function ListingProvider({ children }: ListingProviderProps) {
  const [state, dispatch] = useReducer(listingReducer, initialState);

  useEffect(() => {
    loadPersistedData();
    loadMongoData();
  }, []);

  const loadMongoData = async () => {
    try {
      const mongoService = GameHubMongoService.getInstance();

      const connected = await mongoService.connect();

      if (connected) {
        console.log("Connected to backend, loading games...");

        const listings = await mongoService.getListings();

        dispatch({ type: "SET_LISTINGS", payload: listings });
        console.log(`Loaded ${listings.length} games from backend`);
      } else {
        console.log("Failed to connect to backend");
        dispatch({ type: "SET_LISTINGS", payload: [] });
      }
    } catch (error) {
      console.error("Backend error:", error);
      dispatch({ type: "SET_LISTINGS", payload: [] });
    }
  };

  const loadPersistedData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("gamehub_currentUser");
      const savedRememberMe = await AsyncStorage.getItem("gamehub_rememberMe");

      if (savedUser && savedRememberMe === "true") {
        const user = JSON.parse(savedUser);
        dispatch({ type: "SET_USER", payload: user });
      }

      if (savedRememberMe) {
        dispatch({
          type: "SET_REMEMBER_ME",
          payload: savedRememberMe === "true",
        });
      }
    } catch (error) {
      console.error("Error loading persisted data:", error);
    }
  };

  const savePersistedData = async () => {
    try {
      await AsyncStorage.setItem(
        "gamehub_listings",
        JSON.stringify(state.listings)
      );
      await AsyncStorage.setItem(
        "gamehub_rememberMe",
        state.rememberMe.toString()
      );

      if (state.currentUser && state.rememberMe) {
        await AsyncStorage.setItem(
          "gamehub_currentUser",
          JSON.stringify(state.currentUser)
        );
      } else {
        await AsyncStorage.removeItem("gamehub_currentUser");
      }
    } catch (error) {
      console.error("Error saving persisted data:", error);
    }
  };

  // Generate unique ID
  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Context value
  const contextValue: ListingContextType = {
    listings: state.listings,
    filteredListings: state.filteredListings,
    selectedCategory: state.selectedCategory,
    searchQuery: state.searchQuery,
    currentUser: state.currentUser,
    rememberMe: state.rememberMe,

    addListing: async (listingData) => {
      try {
        const mongoService = GameHubMongoService.getInstance();

        if (mongoService.isConnected()) {
          // Use MongoDB service to create listing
          const newListing = await mongoService.createListing(listingData);
          dispatch({ type: "ADD_LISTING", payload: newListing });
          console.log("Blog game added to MongoDB:", newListing.title);
        } else {
          const newListing: Listing = {
            ...listingData,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: state.currentUser?.id,
          };
          dispatch({ type: "ADD_LISTING", payload: newListing });
          console.log("Blog game added locally:", newListing.title);
        }
      } catch (error) {
        console.error("Error adding listing:", error);
        const newListing: Listing = {
          ...listingData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: state.currentUser?.id,
        };
        dispatch({ type: "ADD_LISTING", payload: newListing });
      }
    },

    updateListing: async (id, updates) => {
      try {
        const mongoService = GameHubMongoService.getInstance();

        if (mongoService.isConnected()) {
          const updatedListing = await mongoService.updateListing(id, updates);
          if (updatedListing) {
            dispatch({ type: "UPDATE_LISTING", payload: { id, updates } });
            console.log("Blog game updated in MongoDB:", updatedListing.title);
          }
        } else {
          dispatch({ type: "UPDATE_LISTING", payload: { id, updates } });
          console.log("Blog game updated locally");
        }
      } catch (error) {
        console.error("Error updating listing:", error);
        dispatch({ type: "UPDATE_LISTING", payload: { id, updates } });
      }
    },

    deleteListing: async (id) => {
      try {
        const mongoService = GameHubMongoService.getInstance();

        if (mongoService.isConnected()) {
          const success = await mongoService.deleteListing(id);
          if (success) {
            dispatch({ type: "DELETE_LISTING", payload: id });
            console.log("Blog game deleted from MongoDB");
          }
        } else {
          dispatch({ type: "DELETE_LISTING", payload: id });
          console.log("Blog game deleted locally");
        }
      } catch (error) {
        console.error("Error deleting listing:", error);
        dispatch({ type: "DELETE_LISTING", payload: id });
      }
    },

    setSelectedCategory: (category) => {
      dispatch({ type: "SET_CATEGORY", payload: category });
    },

    setSearchQuery: (query) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    },

    login: async (email, password) => {
      const mockUser: User = {
        id: generateId(),
        name: "GameMaster",
        email,
        phone: "+370 600 00000",
      };
      dispatch({ type: "SET_USER", payload: mockUser });
      return true;
    },

    register: async (userData, password) => {
      const newUser: User = {
        ...userData,
        id: generateId(),
      };
      dispatch({ type: "SET_USER", payload: newUser });
      return true;
    },

    logout: () => {
      dispatch({ type: "SET_USER", payload: null });
      AsyncStorage.removeItem("gamehub_currentUser");
    },

    setRememberMe: (remember) => {
      dispatch({ type: "SET_REMEMBER_ME", payload: remember });
    },
  };

  return (
    <ListingContext.Provider value={contextValue}>
      {children}
    </ListingContext.Provider>
  );
}

export function useListings(): ListingContextType {
  const context = useContext(ListingContext);
  if (context === undefined) {
    throw new Error("useListings must be used within a ListingProvider");
  }
  return context;
}
