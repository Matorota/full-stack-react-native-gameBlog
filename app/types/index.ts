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
  platform?: string;
  genre?: string;
}

export interface BlogGame {
  _id?: string;
  name: string;
  description: string;
  price: string;
  img: string;
  contacts_nr: string;
  filter?: string;
}

export interface BlogGameDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  description: string;
  price: string;
  img: string;
  contacts_nr: string;
  filter?: string;
}

const mapFilterToCategory = (filter?: string): Category => {
  if (!filter) return Category.GAMES;

  const lowerFilter = filter.toLowerCase();
  switch (lowerFilter) {
    case "games":
    case "game":
      return Category.GAMES;
    case "consoles":
    case "console":
      return Category.CONSOLES;
    case "accessories":
    case "accessory":
      return Category.ACCESSORIES;
    case "pc_components":
    case "pc components":
    case "pc":
      return Category.PC_COMPONENTS;
    case "merchandise":
      return Category.MERCHANDISE;
    case "collectibles":
    case "collectible":
      return Category.COLLECTIBLES;
    case "digital":
      return Category.DIGITAL;
    case "action":
    case "strategy":
    case "rpg":
    case "fps":
    case "adventure":
      return Category.GAMES; // Map game genres to GAMES category
    default:
      return Category.OTHER;
  }
};

export const blogGameToListing = (blogGame: BlogGame): Listing => ({
  id: blogGame._id || "",
  title: blogGame.name,
  description: blogGame.description,
  price: parseFloat(blogGame.price) || 0,
  images: [blogGame.img],
  contact: {
    name: "Game Seller",
    phone: blogGame.contacts_nr,
    email: "contact@example.com",
  },
  category: mapFilterToCategory(blogGame.filter),
  createdAt: new Date(),
  updatedAt: new Date(),
  condition: "good" as const,
  platform: "PC",
  genre: blogGame.filter || "Action",
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
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password?: string; // Don't include in frontend state
}

export interface AuthUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface ListingContextType {
  listings: Listing[];
  filteredListings: Listing[];
  selectedCategory: Category | "all";
  searchQuery: string;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;

  addListing: (
    listing: Omit<Listing, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;

  setSelectedCategory: (category: Category | "all") => void;
  setSearchQuery: (query: string) => void;

  // Authentication
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;

  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
}
