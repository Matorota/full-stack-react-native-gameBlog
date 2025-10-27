const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://matasmatasp:Nb8F0gvq4v2Q7TfY@cluster0.sdochay.mongodb.net/?appName=Cluster0";

const testGames = [
  {
    name: "PlayStation 5",
    description: "Brand new PS5 console with controller",
    price: "500",
    img: "https://example.com/ps5.jpg",
    contacts_nr: "+370 12345678",
    filter: "consoles",
  },
  {
    name: "Gaming Headset",
    description: "High quality wireless gaming headset",
    price: "80",
    img: "https://example.com/headset.jpg",
    contacts_nr: "+370 87654321",
    filter: "accessories",
  },
  {
    name: "RTX 4080 Graphics Card",
    description: "NVIDIA RTX 4080 graphics card, barely used",
    price: "800",
    img: "https://example.com/rtx4080.jpg",
    contacts_nr: "+370 11111111",
    filter: "pc_components",
  },
];

async function addTestGames() {
  console.log("Adding test games with different categories...");

  let client;
  try {
    client = await MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected successfully!");

    const db = client.db("blogGames");
    const collection = db.collection("blogGames");

    // Check if test games already exist
    const existingPS5 = await collection.findOne({ name: "PlayStation 5" });
    if (existingPS5) {
      console.log("⚠️ Test games already exist, skipping insertion");
    } else {
      // Insert test games
      const result = await collection.insertMany(testGames);
      console.log(`✅ Added ${result.insertedCount} test games`);
    }

    // Show all games
    const allGames = await collection.find({}).toArray();
    console.log(`📋 Total games in database: ${allGames.length}`);

    console.log("\n🎮 All games with their categories:");
    allGames.forEach((game, index) => {
      console.log(
        `${index + 1}. ${game.name} - Category: ${game.filter || "none"}`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (client) {
      await client.close();
      console.log("✅ Connection closed");
    }
  }
}

addTestGames();
