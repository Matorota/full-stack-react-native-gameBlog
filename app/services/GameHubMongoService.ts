import { Listing, BlogGame, blogGameToListing } from "../types";

// Simple REST API Service for GameHub MongoDB Backend
class GameHubMongoService {
  private static instance: GameHubMongoService;
  private connected = false;
  private connectionStatus:
    | "connecting"
    | "connected"
    | "disconnected"
    | "error" = "disconnected";
  private connectionError: string | null = null;

  // Backend API URL - change this to your backend URL
  private baseUrl = "http://10.77.146.73:3000/api";

  private constructor() {}

  static getInstance(): GameHubMongoService {
    if (!GameHubMongoService.instance) {
      GameHubMongoService.instance = new GameHubMongoService();
    }
    return GameHubMongoService.instance;
  }

  // Get connection status for UI display
  getConnectionStatus(): {
    status: "connecting" | "connected" | "disconnected" | "error";
    error: string | null;
    database: string;
    collection: string;
  } {
    return {
      status: this.connectionStatus,
      error: this.connectionError,
      database: "blogGames",
      collection: "blogGames",
    };
  }

  async connect(): Promise<boolean> {
    this.connectionStatus = "connecting";
    this.connectionError = null;

    try {
      console.log("Connecting to GameHub Backend API...");
      console.log("URL:", this.baseUrl);

      // Test the connection by checking health endpoint
      const response = await fetch(`${this.baseUrl}/health`);

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "OK") {
        console.log(" Connected to GameHub Backend API");
        console.log(" Database:", result.database);

        this.connected = true;
        this.connectionStatus = "connected";
        return true;
      } else {
        throw new Error("Backend API is not ready");
      }
    } catch (error: any) {
      console.error(" Backend connection failed:", error);
      this.connected = false;
      this.connectionStatus = "error";
      this.connectionError = error.message || "Unknown error";
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.connectionStatus = "disconnected";
    console.log(" Disconnected from Backend API");
  }

  // Get all games with optional filters
  async getListings(filters?: {
    category?: string;
    platform?: string;
    genre?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Listing[]> {
    if (!this.connected) {
      throw new Error("Database not connected. Please connect first.");
    }

    try {
      console.log(" Fetching games from backend...");

      const queryParams = new URLSearchParams();
      if (filters?.minPrice)
        queryParams.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice)
        queryParams.append("maxPrice", filters.maxPrice.toString());

      const url = `${this.baseUrl}/games${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      const blogGames = result.data || [];

      console.log(`Loaded ${blogGames.length} games from backend`);

      // Convert to Listing format
      return blogGames.map((doc: any) => {
        const blogGame: BlogGame = {
          ...doc,
          _id: doc._id || doc.id,
        };
        return blogGameToListing(blogGame);
      });
    } catch (error) {
      console.error(" Error fetching listings:", error);
      throw error;
    }
  }

  // Add a new game
  async createListing(
    listing: Omit<Listing, "id" | "createdAt" | "updatedAt">
  ): Promise<Listing> {
    if (!this.connected) {
      throw new Error("Database not connected. Please connect first.");
    }

    try {
      console.log(" Adding new game:", listing.title);

      const blogGameData = {
        name: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        img: listing.images[0] || "",
        contacts_nr: listing.contact.phone,
        filter: listing.genre || "other",
      };

      const response = await fetch(`${this.baseUrl}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogGameData),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      const newGame = result.data;

      console.log(" Game added to database");

      return {
        ...listing,
        id: newGame._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  }

  // Update an existing game
  async updateListing(
    id: string,
    updates: Partial<Listing>
  ): Promise<Listing | null> {
    if (!this.connected) {
      throw new Error("Database not connected. Please connect first.");
    }

    try {
      console.log(" Updating game:", id);

      const updateData: any = {};
      if (updates.title) updateData.name = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.price !== undefined)
        updateData.price = updates.price.toString();
      if (updates.images && updates.images.length > 0)
        updateData.img = updates.images[0];
      if (updates.contact?.phone)
        updateData.contacts_nr = updates.contact.phone;
      if (updates.genre) updateData.filter = updates.genre;

      const response = await fetch(`${this.baseUrl}/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(" Game not found");
          return null;
        }
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      const updatedGame = result.data;

      console.log(" Game updated in database");

      const blogGame: BlogGame = {
        ...updatedGame,
        _id: updatedGame._id || id,
      };
      return blogGameToListing(blogGame);
    } catch (error) {
      console.error(" Error updating listing:", error);
      throw error;
    }
  }

  // Delete a game
  async deleteListing(id: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error("Database not connected. Please connect first.");
    }

    try {
      console.log("🗑️ Deleting game:", id);

      const response = await fetch(`${this.baseUrl}/games/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(" Game not found");
          return false;
        }
        throw new Error(`Backend API error: ${response.status}`);
      }

      console.log(" Game deleted from database");
      return true;
    } catch (error) {
      console.error(" Error deleting listing:", error);
      throw error;
    }
  }

  // Search games
  async searchListings(query: string): Promise<Listing[]> {
    if (!this.connected) {
      throw new Error("Database not connected. Please connect first.");
    }

    try {
      console.log("🔍 Searching games for:", query);

      const response = await fetch(
        `${this.baseUrl}/games/search/${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      const blogGames = result.data || [];

      console.log(`📊 Found ${blogGames.length} matching games`);

      return blogGames.map((doc: any) => {
        const blogGame: BlogGame = {
          ...doc,
          _id: doc._id || doc.id,
        };
        return blogGameToListing(blogGame);
      });
    } catch (error) {
      console.error(" Error searching listings:", error);
      throw error;
    }
  }

  // Get statistics
  async getGamingStats(): Promise<{
    totalListings: number;
    totalValue: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
  }> {
    if (!this.connected) {
      throw new Error("Database not connected. Please connect first.");
    }

    try {
      const response = await fetch(`${this.baseUrl}/stats`);

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(" Error getting gaming stats:", error);
      throw error;
    }
  }

  // Health check
  isConnected(): boolean {
    return this.connected;
  }

  getConnectionInfo(): {
    uri: string;
    connected: boolean;
    dbName: string;
    collection: string;
  } {
    return {
      uri: this.connected ? this.baseUrl : "Not connected",
      connected: this.connected,
      dbName: "blogGames",
      collection: "blogGames",
    };
  }
}

export default GameHubMongoService;
