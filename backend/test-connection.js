const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://matasmatasp:Nb8F0gvq4v2Q7TfY@cluster0.sdochay.mongodb.net/?appName=Cluster0";

async function testConnection() {
  console.log("Testing MongoDB connection...");
  console.log("URI:", uri);

  try {
    const client = await MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected successfully!");

    const db = client.db("blogGames");
    const collection = db.collection("blogGames");

    const count = await collection.countDocuments();
    console.log(`📊 Found ${count} documents in blogGames collection`);

    const games = await collection.find({}).limit(3).toArray();
    console.log("First 3 games:", JSON.stringify(games, null, 2));

    await client.close();
    console.log("✅ Test complete!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

testConnection();
