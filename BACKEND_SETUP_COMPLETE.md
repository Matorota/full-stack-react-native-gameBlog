# 🎮 GameHub MongoDB Backend - COMPLETE SETUP GUIDE

## ✅ PROBLEM SOLVED!

The CORS issue with MongoDB Data API has been **completely solved** by creating a simple Express.js backend server that:

- ✅ Connects directly to your MongoDB Atlas database
- ✅ Provides a REST API for your React Native app
- ✅ Handles all CRUD operations
- ✅ No CORS issues!
- ✅ Works with your existing MongoDB credentials

---

## 🏗️ ARCHITECTURE

```
React Native App (Frontend)
        ↓
   HTTP Requests
        ↓
Express.js Backend (localhost:3000)
        ↓
   MongoDB Driver
        ↓
MongoDB Atlas (blogGames database)
```

---

## 📁 PROJECT STRUCTURE

```
trecias-react-native/
├── backend/                          # NEW! Backend server
│   ├── server.js                     # Express.js API server
│   ├── package.json                  # Backend dependencies
│   └── .env                          # MongoDB credentials
├── app/
│   ├── services/
│   │   └── GameHubMongoService.ts    # UPDATED! Now uses REST API
│   └── contexts/
│       └── ListingContext.tsx        # UPDATED! Simplified connection
```

---

## 🚀 HOW TO START

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd /mnt/d/programing/trecias-react-native/trecias-react-native/backend
npm start
```

You should see:

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
📁 Database: blogGames
📄 Collection: blogGames
🚀 Server running on http://localhost:3000
📡 API endpoints:
   - GET    /api/health
   - GET    /api/games
   - GET    /api/games/:id
   - POST   /api/games
   - PUT    /api/games/:id
   - DELETE /api/games/:id
   - GET    /api/games/search/:query
   - GET    /api/stats
```

### Step 2: Start the React Native App

Open a **NEW** terminal and run:

```bash
cd /mnt/d/programing/trecias-react-native/trecias-react-native
npm start
```

Press `w` to open in web browser.

---

## 🔧 CONFIGURATION

### Backend Configuration (backend/.env)

```env
MONGODB_URI=mongodb+srv://matasmatasp:Nb8F0gvq4v2Q7TfY@cluster0.sdochay.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=blogGames
MONGODB_COLLECTION_NAME=blogGames
PORT=3000
```

### Frontend Configuration (app/services/GameHubMongoService.ts)

```typescript
private baseUrl = "http://localhost:3000/api";
```

**Note**: If you deploy the backend, change this to your deployed URL (e.g., `https://your-app.herokuapp.com/api`)

---

## 📡 API ENDPOINTS

### Health Check

```bash
GET /api/health
```

Returns server status and MongoDB connection info.

### Get All Games

```bash
GET /api/games
GET /api/games?minPrice=10&maxPrice=50
```

### Get Single Game

```bash
GET /api/games/:id
```

### Create New Game

```bash
POST /api/games
Content-Type: application/json

{
  "name": "Game Title",
  "description": "Game description",
  "price": "29.99",
  "img": "https://example.com/image.jpg",
  "contacts_nr": "+370 600 00000",
  "filter": "action"
}
```

### Update Game

```bash
PUT /api/games/:id
Content-Type: application/json

{
  "name": "Updated Title",
  "price": "19.99"
}
```

### Delete Game

```bash
DELETE /api/games/:id
```

### Search Games

```bash
GET /api/games/search/:query
GET /api/games/search/zelda
```

### Get Statistics

```bash
GET /api/stats
```

---

## ✅ WHAT'S FIXED

### Before (PROBLEMS):

- ❌ CORS errors with MongoDB Data API
- ❌ Incorrect App ID (data-hyvgxzc)
- ❌ 204 No Content responses
- ❌ Cannot connect from browser/React Native

### After (SOLUTIONS):

- ✅ Backend server handles MongoDB connection
- ✅ No CORS issues (backend has CORS enabled)
- ✅ Simple REST API
- ✅ Works from any device on same network
- ✅ Real MongoDB data from `blogGames` collection

---

## 🧪 TESTING

### Test Backend Connection

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test get all games
curl http://localhost:3000/api/games

# Test create game
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Game",
    "description": "A test game",
    "price": "9.99",
    "img": "https://via.placeholder.com/300",
    "contacts_nr": "+370 600 00000",
    "filter": "test"
  }'
```

### Test from React Native App

1. Start backend server: `cd backend && npm start`
2. Start React Native app: `npm start`
3. Open app in browser (press `w`)
4. Check the connection indicator at the top:
   - 🟢 Green = Connected to backend
   - 🔴 Red = Backend not running

---

## 📊 CONNECTION STATUS INDICATOR

The app now shows a **real-time connection status** at the top:

- 🟢 **Connected** - Backend is running, MongoDB is accessible
- 🟡 **Connecting** - Attempting to connect
- 🔴 **Error** - Backend is not running or MongoDB connection failed
- ⚪ **Disconnected** - Not connected

Click on the indicator to see detailed information:

- Database name
- Collection name
- Error messages (if any)

---

## 🎯 USAGE IN APP

### Adding Games

```typescript
// Automatically uses MongoDB via backend
await addListing({
  title: "New Game",
  description: "Description",
  price: 29.99,
  images: ["https://..."],
  contact: { phone: "+370..." },
});
```

### Updating Games

```typescript
await updateListing(gameId, {
  price: 19.99,
  description: "Updated description",
});
```

### Deleting Games

```typescript
await deleteListing(gameId);
```

### Searching Games

```typescript
await searchListings("zelda");
```

---

## 🚨 TROUBLESHOOTING

### Backend Won't Start

**Problem**: Server hangs or shows no output
**Solution**:

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Try again
cd backend && npm start
```

### Connection Error in App

**Problem**: Red connection indicator
**Solutions**:

1. Make sure backend is running (`cd backend && npm start`)
2. Check backend URL in `GameHubMongoService.ts`
3. Make sure you're on the same network

### MongoDB Connection Error

**Problem**: Backend shows "MongoDB connection error"
**Solutions**:

1. Check MongoDB credentials in `backend/.env`
2. Verify MongoDB Atlas allows connections from your IP
3. Test connection string in MongoDB Compass

### No Games Showing

**Problem**: App connects but shows no games
**Solutions**:

1. Check if games exist in MongoDB Atlas
2. Use MongoDB Compass to view/add games manually
3. Check backend logs for errors

---

## 📝 DEVELOPMENT WORKFLOW

1. **Start Backend** (Terminal 1):

   ```bash
   cd backend
   npm start
   # Leave this running
   ```

2. **Start Frontend** (Terminal 2):

   ```bash
   npm start
   # Press 'w' for web
   ```

3. **Make Changes**:
   - Edit backend code → Server auto-restarts (if using `npm run dev`)
   - Edit frontend code → Hot reload automatically

---

## 🌐 DEPLOYMENT (Optional)

### Deploy Backend to Heroku

```bash
cd backend
heroku create your-gamehub-backend
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

Then update frontend:

```typescript
// GameHubMongoService.ts
private baseUrl = "https://your-gamehub-backend.herokuapp.com/api";
```

---

## ✅ SUMMARY

You now have:

- ✅ Working Express.js backend connected to MongoDB
- ✅ REST API for all CRUD operations
- ✅ No CORS issues
- ✅ Real-time connection status indicator
- ✅ Direct access to your `blogGames` database
- ✅ All sample data removed (uses ONLY MongoDB)

**Next Steps**:

1. Start the backend: `cd backend && npm start`
2. Start the app: `npm start`
3. Check connection indicator is green
4. Add/edit/delete games!

🎮 **Your GameHub app is now fully connected to MongoDB!** 🎮
