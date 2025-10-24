#!/bin/bash

echo "🎮 GameHub MongoDB Backend - Quick Start Script"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: backend directory not found${NC}"
    echo "Please run this script from: /mnt/d/programing/trecias-react-native/trecias-react-native"
    exit 1
fi

echo "Step 1: Testing MongoDB connection..."
echo "-------------------------------------"
cd backend

if ! node test-connection.js 2>&1 | grep -q "Connected successfully"; then
    echo -e "${RED}❌ MongoDB connection failed!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to configure MongoDB Atlas Network Access${NC}"
    echo ""
    echo "Follow these steps:"
    echo "1. Go to: https://cloud.mongodb.com"
    echo "2. Click 'Network Access' (left sidebar)"
    echo "3. Click 'Add IP Address'"
    echo "4. Select 'Allow Access from Anywhere'"
    echo "5. Click 'Confirm'"
    echo "6. Wait 1-2 minutes, then run this script again"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ MongoDB connection successful!${NC}"
echo ""

echo "Step 2: Starting backend server..."
echo "-----------------------------------"
echo -e "${YELLOW}Backend will start on http://localhost:3000${NC}"
echo -e "${YELLOW}Keep this terminal open!${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
