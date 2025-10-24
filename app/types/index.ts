export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  condition?: "new" | "like_new" | "good" | "fair" | "poor";
  platform?: string; // Gaming platform (PC, PS5, Xbox, etc.)
  genre?: string; // Game genre
}

// MongoDB Blog Game structure (matches your existing data)
export interface BlogGame {
  _id?: string; // Optional for new documents, MongoDB generates ObjectId
  name: string;
  description: string;
  price: string;
  img: string;
  contacts_nr: string;
  filter?: string; // Filter field from your MongoDB data
}

// MongoDB Blog Game with ObjectId (for internal MongoDB operations)
export interface BlogGameDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  description: string;
  price: string;
  img: string;
  contacts_nr: string;
  filter?: string; // Filter field from your MongoDB data
}

// Adapter functions to convert between BlogGame and Listing
export const blogGameToListing = (blogGame: BlogGame): Listing => ({
  id: blogGame._id || "",
  title: blogGame.name,
  description: blogGame.description,
  price: parseFloat(blogGame.price) || 0,
  images: [blogGame.img],
  contact: {
    name: "Game Seller", // Default since not in BlogGame
    phone: blogGame.contacts_nr,
    email: "contact@example.com", // Default since not in BlogGame
  },
  category: Category.GAMES, // Default to games category
  createdAt: new Date(),
  updatedAt: new Date(),
  condition: "good" as const,
  platform: "PC", // Default platform
  genre: "Action", // Default genre
});

export const listingToBlogGame = (listing: Listing): Omit<BlogGame, "_id"> => ({
  name: listing.title,
  description: listing.description,
  price: listing.price.toString(),
  img: listing.images[0] || "",
  contacts_nr: listing.contact.phone,
});

export enum Category {
  GAMES = "games",
  CONSOLES = "consoles",
  ACCESSORIES = "accessories",
  PC_COMPONENTS = "pc_components",
  MERCHANDISE = "merchandise",
  COLLECTIBLES = "collectibles",
  DIGITAL = "digital",
  OTHER = "other",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ListingContextType {
  listings: Listing[];
  filteredListings: Listing[];
  selectedCategory: Category | "all";
  searchQuery: string;
  currentUser: User | null;

  // CRUD operations (now async for MongoDB support)
  addListing: (
    listing: Omit<Listing, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;

  // Filtering and search
  setSelectedCategory: (category: Category | "all") => void;
  setSearchQuery: (query: string) => void;

  // Authentication (bonus)
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Omit<User, "id">, password: string) => Promise<boolean>;
  logout: () => void;

  // Remember me (bonus)
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
}
