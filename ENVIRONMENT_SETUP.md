# Environment Variables Setup Guide

## Overview

The GameHub app now uses environment variables for configuration, making it secure and flexible for different deployment environments.

## Frontend Configuration

### Files:

- `.env` - Your actual environment variables (ignored by git)
- `.env.example` - Template file (tracked by git)

### Variables:

- `EXPO_PUBLIC_API_BASE_URL` - The backend API URL

### Usage:

```typescript
// In GameHubMongoService.ts
private baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
```

## Backend Configuration

### Files:

- `backend/.env` - Your actual MongoDB credentials (ignored by git)
- `backend/.env.example` - Template file (tracked by git)

### Variables:

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- `MONGODB_COLLECTION_NAME` - Collection name
- `PORT` - Server port

## Setup Instructions

### For Development:

1. Copy `.env.example` to `.env`
2. Update `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api`

### For Mobile Testing:

1. Find your network IP address:
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```
2. Update `.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:3000/api
   ```

### For Production:

1. Set environment variables in your deployment platform
2. Ensure `.env` files are not included in deployments

## Security Notes

- `.env` files are ignored by git and never committed
- Use `.env.example` files to document required variables
- Never commit actual credentials or API keys
- Backend `.env` contains MongoDB Atlas credentials

## Current Configuration

- Frontend baseUrl: Reads from `EXPO_PUBLIC_API_BASE_URL`
- Backend: MongoDB Atlas connection via environment variables
- All sample data removed - uses MongoDB only
- Mobile-friendly configuration for testing on devices
