# Deployment Guide

This guide will help you deploy both the Socket.IO server and the Next.js frontend.

## Step 1: Deploy Socket.IO Server to Railway

### 1.1 Create Server Repository

1. Create a new GitHub repository called `stagetimer-server`
2. Clone it locally:
   ```bash
   git clone https://github.com/yourusername/stagetimer-server.git
   cd stagetimer-server
   ```

### 1.2 Add Server Files

Copy these files from your current project to the new server repository:

**`server.js`** (copy from `standalone-server.js`):
```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://online-timer-qk76.vercel.app",
  credentials: true
}));

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://online-timer-qk76.vercel.app",
    credentials: true
  }
});

// ... rest of the server code from standalone-server.js
```

**`package.json`** (copy from `server-package.json`):
```json
{
  "name": "stagetimer-server",
  "version": "1.0.0",
  "description": "Socket.IO server for Stage Timer App",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.3 Deploy to Railway

1. Go to [Railway](https://railway.app/) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `stagetimer-server` repository
4. Railway will automatically deploy it
5. Note the URL (e.g., `https://your-app-name.railway.app`)

### 1.4 Set Environment Variables

In Railway dashboard → Variables tab:
- `FRONTEND_URL`: `https://online-timer-qk76.vercel.app`
- `CONTROLLER_PASSWORD`: `admin123`

## Step 2: Update Frontend for Production

### 2.1 Add Environment Variable

In your Vercel project, add this environment variable:
- `NEXT_PUBLIC_SOCKET_SERVER_URL`: `https://your-app-name.railway.app`

### 2.2 Local Development

For local development, create a `.env.local` file in your project root:
```
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:3001
```

### 2.3 Test Locally

1. Start your local server:
   ```bash
   cd stagetimer-server
   npm install
   npm start
   ```

2. Start your frontend:
   ```bash
   npm run dev
   ```

3. Test the connection at `http://localhost:3000`

## Step 3: Deploy Frontend to Vercel

### 3.1 Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add: `NEXT_PUBLIC_SOCKET_SERVER_URL` = `https://your-app-name.railway.app`
4. Redeploy your project

### 3.2 Test Production

1. Visit your Vercel URL
2. Test timer functionality
3. Check Railway logs for connections

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure `FRONTEND_URL` is set correctly in Railway
   - Check that the URL matches exactly (including https://)

2. **Connection Refused**
   - Verify the Railway URL is correct in your frontend
   - Check Railway logs for server errors

3. **Authentication Fails**
   - Verify `CONTROLLER_PASSWORD` is set correctly in Railway
   - Check that the password matches in your frontend

4. **WebSocket Errors**
   - Railway supports WebSockets automatically
   - Check that your frontend is using the correct server URL

### Debugging

1. **Check Railway Logs**
   - Go to Railway dashboard → Deployments → View logs
   - Look for connection messages and errors

2. **Check Vercel Logs**
   - Go to Vercel dashboard → Functions → View logs
   - Look for client-side errors

3. **Browser Console**
   - Open browser dev tools
   - Check for WebSocket connection errors
   - Look for CORS errors

## Alternative Platforms

If Railway doesn't work, try:

### Render
1. Similar to Railway
2. Supports WebSockets
3. Free tier available

### Heroku
1. Classic choice
2. Supports WebSockets
3. Requires credit card for free tier

### DigitalOcean App Platform
1. Good performance
2. Supports WebSockets
3. Paid service

## Security Notes

1. **Environment Variables**: Never commit passwords to Git
2. **CORS**: Only allow your specific frontend domain
3. **Authentication**: Use strong passwords in production
4. **HTTPS**: Always use HTTPS in production

## Monitoring

1. **Railway**: Monitor server logs and performance
2. **Vercel**: Monitor frontend performance and errors
3. **Health Check**: Use `/health` endpoint to monitor server status 