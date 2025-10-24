#!/usr/bin/env node

// Simple MongoDB Atlas Data API connection test
const API_KEY = "Nb8F0gvq4v2Q7TfY";
const BASE_URL =
  "https://us-east-1.aws.data.mongodb-api.com/app/data-hyvgxzc/endpoint/data/v1";

async function testMongoConnection() {
  console.log("🔌 Testing MongoDB Atlas Data API connection...");
  console.log("🔑 API Key:", API_KEY);
  console.log("🌐 Base URL:", BASE_URL);

  try {
    const testBody = {
      dataSource: "Cluster0",
      database: "blogGames",
      collection: "blogGames",
      limit: 1,
    };

    console.log("📤 Sending test request...");
    const response = await fetch(`${BASE_URL}/action/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify(testBody),
    });

    console.log("📥 Response status:", response.status);
    console.log(
      "📥 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ MongoDB Atlas Data API connection successful!");
      console.log("📊 Result:", JSON.stringify(result, null, 2));

      if (result.documents && result.documents.length > 0) {
        console.log(
          `📄 Found ${result.documents.length} documents in collection`
        );
      } else {
        console.log("📄 Collection is empty - this is normal for a new setup");
      }

      return true;
    } else {
      const errorText = await response.text();
      console.error("❌ MongoDB Atlas Data API connection failed!");
      console.error("📥 Status:", response.status, response.statusText);
      console.error("📥 Error response:", errorText);
      return false;
    }
  } catch (error) {
    console.error("❌ Network error connecting to MongoDB Atlas Data API:");
    console.error("🔍 Error details:", error.message);
    console.error("🔍 Full error:", error);
    return false;
  }
}

// Test creating a sample document
async function testCreateDocument() {
  console.log("\n➕ Testing document creation...");

  try {
    const sampleDocument = {
      name: "Test Game - " + new Date().toISOString(),
      description: "A test game created by the connection test script",
      price: "19.99",
      img: "https://via.placeholder.com/300x400/4ade80/ffffff?text=Test+Game",
      contacts_nr: "+370 600 00000",
      filter: "test",
      createdAt: new Date().toISOString(),
    };

    const createBody = {
      dataSource: "Cluster0",
      database: "blogGames",
      collection: "blogGames",
      document: sampleDocument,
    };

    const response = await fetch(`${BASE_URL}/action/insertOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify(createBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Document created successfully!");
      console.log("📄 Inserted ID:", result.insertedId);
      return result.insertedId;
    } else {
      const errorText = await response.text();
      console.error("❌ Failed to create document");
      console.error("📥 Error:", errorText);
      return null;
    }
  } catch (error) {
    console.error("❌ Error creating document:", error.message);
    return null;
  }
}

// Run the tests
async function runTests() {
  console.log("🧪 MongoDB Atlas Data API Connection Test");
  console.log("=".repeat(50));

  const connectionSuccess = await testMongoConnection();

  if (connectionSuccess) {
    console.log("\n🎯 Connection successful! Testing CRUD operations...");
    const insertedId = await testCreateDocument();

    if (insertedId) {
      console.log(
        "\n✅ All tests passed! MongoDB Atlas Data API is working correctly."
      );
      console.log(
        "🎉 Your React Native app should now connect to MongoDB successfully."
      );
    } else {
      console.log("\n⚠️ Connection works but document creation failed.");
      console.log(
        "💡 Check your MongoDB Atlas permissions and collection settings."
      );
    }
  } else {
    console.log("\n❌ Connection failed. Possible issues:");
    console.log("1. API Key might be invalid or expired");
    console.log("2. Data API might not be enabled in MongoDB Atlas");
    console.log("3. Network connectivity issues");
    console.log("4. CORS or firewall restrictions");
    console.log("\n💡 The app will fall back to localStorage in this case.");
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === "undefined") {
  console.error(
    "❌ This script requires Node.js 18+ with built-in fetch support"
  );
  console.error("💡 Please upgrade Node.js or install node-fetch");
  process.exit(1);
}

runTests().catch(console.error);
