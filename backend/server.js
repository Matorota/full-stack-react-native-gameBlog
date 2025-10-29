const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db;
let collection;
let usersCollection;

const connectToMongoDB = async () => {
  try {
    console.log(" Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(process.env.MONGODB_DB_NAME);
    collection = db.collection(process.env.MONGODB_COLLECTION_NAME);
    usersCollection = db.collection("users");
    console.log(" Connected to MongoDB");
    console.log(" Database:", process.env.MONGODB_DB_NAME);
    console.log(" Collection:", process.env.MONGODB_COLLECTION_NAME);
    console.log(" Users Collection: users");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "GameHub Backend API is running",
    database: db ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ======================
// AUTHENTICATION ENDPOINTS
// ======================

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    console.log(`✓ User logged in: ${user.email}`);

    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      name: name.trim(),
      surname: surname.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    userWithoutPassword._id = result.insertedId;

    console.log(`✓ User registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Change password endpoint
app.post("/api/auth/change-password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "User ID, current password, and new password are required",
      });
    }

    // Find user
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      }
    );

    console.log(`✓ Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Check email endpoint
app.post("/api/auth/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    res.json({
      success: true,
      exists: !!user,
    });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ======================
// GAME ENDPOINTS
// =====================

app.get("/api/games", async (req, res) => {
  try {
    const { minPrice, maxPrice, search, category } = req.query;

    let filter = {};

    // Category filtering
    if (category && category !== "all") {
      filter.filter = category;
      console.log(` Filtering by filter: ${category}`);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const games = await collection.find(filter).toArray();

    console.log(` Retrieved ${games.length} games`);
    res.json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error(" Error fetching games:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get single game by ID
app.get("/api/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const game = await collection.findOne({ _id: new ObjectId(id) });

    if (!game) {
      return res.status(404).json({
        success: false,
        error: "Game not found",
      });
    }

    res.json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error(" Error fetching game:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/api/games", async (req, res) => {
  try {
    const gameData = req.body;

    if (!gameData.name || !gameData.description || !gameData.price) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, description, price",
      });
    }

    const result = await collection.insertOne(gameData);

    console.log(" Game created with ID:", result.insertedId);

    res.status(201).json({
      success: true,
      data: {
        _id: result.insertedId,
        ...gameData,
      },
    });
  } catch (error) {
    console.error(" Error creating game:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.put("/api/games/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Game not found",
      });
    }

    const updatedGame = await collection.findOne({ _id: new ObjectId(id) });

    console.log("Game updated:", id);

    res.json({
      success: true,
      data: updatedGame,
    });
  } catch (error) {
    console.error(" Error updating game:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.delete("/api/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Game not found",
      });
    }

    console.log("Game deleted:", id);

    res.json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (error) {
    console.error(" Error deleting game:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/games/search/:query", async (req, res) => {
  try {
    const { query } = req.params;

    const games = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    console.log(` Search for "${query}" found ${games.length} results`);

    res.json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error(" Error searching games:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const games = await collection.find({}).toArray();

    const totalGames = games.length;
    const prices = games
      .map((g) => parseFloat(g.price) || 0)
      .filter((p) => p > 0);

    const totalValue = prices.reduce((sum, price) => sum + price, 0);
    const averagePrice = prices.length > 0 ? totalValue / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    res.json({
      success: true,
      data: {
        totalGames,
        totalValue,
        averagePrice,
        priceRange: {
          min: minPrice,
          max: maxPrice,
        },
      },
    });
  } catch (error) {
    console.error(" Error getting stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const startServer = async () => {
  await connectToMongoDB();

  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` API endpoints:`);
    console.log(`   - GET    /api/health`);
    console.log(` Authentication:`);
    console.log(`   - POST   /api/auth/login`);
    console.log(`   - POST   /api/auth/register`);
    console.log(`   - POST   /api/auth/change-password`);
    console.log(`   - POST   /api/auth/check-email`);
    console.log(` Games:`);
    console.log(`   - GET    /api/games`);
    console.log(`   - GET    /api/games/:id`);
    console.log(`   - POST   /api/games`);
    console.log(`   - PUT    /api/games/:id`);
    console.log(`   - DELETE /api/games/:id`);
    console.log(`   - GET    /api/games/search/:query`);
    console.log(`   - GET    /api/stats`);
  });
};

startServer().catch(console.error);
