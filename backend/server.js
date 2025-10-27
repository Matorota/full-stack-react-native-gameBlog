const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db;
let collection;

const connectToMongoDB = async () => {
  try {
    console.log(" Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(process.env.MONGODB_DB_NAME);
    collection = db.collection(process.env.MONGODB_COLLECTION_NAME);
    console.log(" Connected to MongoDB");
    console.log(" Database:", process.env.MONGODB_DB_NAME);
    console.log(" Collection:", process.env.MONGODB_COLLECTION_NAME);
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

app.get("/api/games", async (req, res) => {
  try {
    const { minPrice, maxPrice, search } = req.query;

    let filter = {};

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
