# GameHub - MongoDB Backend Integration

## SETUP COMPLETE

Your GameHub React Native app now has a fully functional MongoDB backend with:

- Express.js REST API server
- Direct MongoDB Atlas connection
- All CRUD operations (Create, Read, Update, Delete)
- Real-time connection status indicator
- NO CORS issues
- NO sample data (MongoDB only)

---

## QUICK START

### Step 1: Environment Variables Setup

1. **Frontend Configuration**:
   - Copy `.env.example` to `.env`
   - Update `EXPO_PUBLIC_API_BASE_URL` with your network IP:
     ```
     EXPO_PUBLIC_API_BASE_URL=http://YOUR_NETWORK_IP:3000/api
     ```
   - For mobile testing: Replace `YOUR_NETWORK_IP` with your computer's IP address
   - For development: Use `http://localhost:3000/api`

2. **Backend Configuration**:
   - The `backend/.env` file is already configured with MongoDB Atlas credentials
   - No changes needed unless you want to use a different database

### Step 2: Configure MongoDB Atlas (ONE TIME ONLY)

IMPORTANT: You MUST do this first or the backend won't connect!

1. Go to: **https://cloud.mongodb.com**
2. Login to your account
3. Click **"Network Access"** (left sidebar)
4. Click **"Add IP Address"**
5. Select **"Allow Access from Anywhere"** (for development)
6. Click **"Confirm"**
7. **Wait 1-2 minutes** for changes to take effect

### Step 3: Start the Backend Server

**Terminal 1**:

```bash
cd /mnt/d/programing/trecias-react-native/trecias-react-native
./start-backend.sh
```

Or manually:

```bash
cd backend
npm start
```

**You should see**:

```
Connecting to MongoDB...
Connected to MongoDB
Database: blogGames
Collection: blogGames
Server running on http://localhost:3000
```

**Keep this terminal open!**

### Step 3: Start the React Native App

**Terminal 2** (new terminal):

```bash
cd /mnt/d/programing/trecias-react-native/trecias-react-native
npm start
```

Press `w` to open in web browser.

### Step 4: Verify Connection

Look at the **top of your app screen**:

- Green dot = SUCCESS! Connected to MongoDB
- Yellow dot = Connecting...
- Red dot = Backend not running or connection failed

Click the indicator to see details.

---

## ARCHITECTURE

```
React Native App (Frontend)
        ↓
   HTTP REST API
        ↓
Express.js Backend (localhost:3000)
        ↓
   MongoDB Driver
        ↓
MongoDB Atlas (blogGames database)
```

---

## CONFIGURATION

### MongoDB Settings

- **Database**: `blogGames`
- **Collection**: `blogGames`
- **Username**: `matasmatasp`
- **Password**: `Nb8F0gvq4v2Q7TfY`

### Backend Server

- **URL**: `http://localhost:3000`
- **Config file**: `backend/.env`

### Frontend

- **Service**: `app/services/GameHubMongoService.ts`
- **Base URL**: `http://localhost:3000/api`

---

## API ENDPOINTS

| Endpoint                   | Method | Description         |
| -------------------------- | ------ | ------------------- |
| `/api/health`              | GET    | Check server status |
| `/api/games`               | GET    | Get all games       |
| `/api/games/:id`           | GET    | Get single game     |
| `/api/games`               | POST   | Create new game     |
| `/api/games/:id`           | PUT    | Update game         |
| `/api/games/:id`           | DELETE | Delete game         |
| `/api/games/search/:query` | GET    | Search games        |
| `/api/stats`               | GET    | Get statistics      |

---

## USAGE

### Adding a Game

1. Click "Add Game" button in app
2. Fill in game details
3. Click "Save"
4. Game is saved to MongoDB
5. Appears immediately in the list

### Editing a Game

1. Click on a game in the list
2. Click "Edit" button
3. Update details
4. Click "Save"
5. Changes saved to MongoDB

### Deleting a Game

1. Click on a game
2. Click "Delete" button
3. Confirm deletion
4. Game removed from MongoDB

### Searching Games

1. Type in the search bar
2. Results filter in real-time
3. Searches game titles and descriptions

---

## TROUBLESHOOTING

### Problem: Backend won't start

**Error**: "MongoDB connection error" or hangs

**Solution**:

1. Configure MongoDB Atlas Network Access (see Step 1 above)
2. Wait 1-2 minutes after configuration
3. Run: `cd backend && node test-connection.js`
4. If test passes, run: `npm start`

### Problem: App shows red indicator

**Error**: Cannot connect to backend

**Solution**:

```bash
# Make sure backend is running
cd backend
npm start
# Keep this terminal open
```

### Problem: No games showing

**Possible causes**:

1. Backend not running → Start it
2. MongoDB empty → Add games manually or through app
3. Connection failed → Check Network Access

**Test**:

```bash
# Test if backend is accessible
curl http://localhost:3000/api/health

# Should return:
# {"status":"OK","message":"GameHub Backend API is running",...}
```

### Problem: "Port 3000 already in use"

**Solution**:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Start backend again
npm start
```

---

## SUCCESS CHECKLIST

Before reporting issues, verify:

- [ ] MongoDB Atlas Network Access configured (allows your IP)
- [ ] Database `blogGames` exists in MongoDB Atlas
- [ ] Collection `blogGames` exists
- [ ] Backend test passes: `node backend/test-connection.js`
- [ ] Backend starts successfully: `cd backend && npm start`
- [ ] Backend health check works: `curl http://localhost:3000/api/health`
- [ ] Frontend starts: `npm start`
- [ ] App shows green connection indicator
- [ ] Games load in the app

---

## FILES CREATED/MODIFIED

### New Files

- `backend/server.js` - Express.js API server
- `backend/package.json` - Backend dependencies
- `backend/.env` - MongoDB credentials
- `backend/test-connection.js` - Connection tester
- `app/components/ConnectionStatusIndicator.tsx` - Status UI
- `start-backend.sh` - Quick start script

### Modified Files

- `app/services/GameHubMongoService.ts` - Now uses REST API
- `app/contexts/ListingContext.tsx` - Simplified connection
- `app/components/GameMarketplace.tsx` - Shows connection indicator

---

**Happy coding! Your GameHub app is now powered by MongoDB!**
