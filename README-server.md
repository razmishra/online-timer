# Stage Timer Server

This is the standalone Socket.IO server for the Stage Timer App. It needs to be deployed separately from the frontend because Vercel doesn't support WebSocket connections.

## Deployment to Railway

### Step 1: Create a new repository for the server

1. Create a new GitHub repository called `stagetimer-server`
2. Clone it to your local machine:
   ```bash
   git clone https://github.com/yourusername/stagetimer-server.git
   cd stagetimer-server
   ```

### Step 2: Copy the server files

Copy these files to your new server repository:
- `standalone-server.js` → `server.js`
- `server-package.json` → `package.json`

### Step 3: Deploy to Railway

1. Go to [Railway](https://railway.app/) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `stagetimer-server` repository
4. Railway will automatically detect it's a Node.js app and deploy it
5. Once deployed, Railway will give you a URL like `https://your-app-name.railway.app`

### Step 4: Set Environment Variables

In your Railway project dashboard:
1. Go to the "Variables" tab
2. Add these environment variables:
   - `FRONTEND_URL`: `https://online-timer-qk76.vercel.app` (your Vercel frontend URL)
   - `CONTROLLER_PASSWORD`: `admin123` (or whatever password you want)

### Step 5: Update Frontend to Use Railway Server

Once your Railway server is deployed, you need to update your frontend to connect to it instead of the local server.

In your `app/hooks/useSocket.js`, change the Socket.IO connection:

```javascript
// Change this line:
const socketInstance = io();

// To this:
const socketInstance = io('https://your-app-name.railway.app');
```

### Step 6: Test the Connection

1. Deploy the updated frontend to Vercel
2. Test the timer functionality
3. Check the Railway logs to ensure connections are working

## Local Development

To test the server locally:

```bash
npm install
npm run dev
```

The server will run on `http://localhost:3001`

## Health Check

The server provides a health check endpoint at `/health` that returns:
```json
{
  "status": "ok",
  "timers": 2,
  "connectedDevices": 3
}
```

## Environment Variables

- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Your Vercel frontend URL for CORS
- `CONTROLLER_PASSWORD`: Password for controller authentication

## Troubleshooting

1. **CORS errors**: Make sure `FRONTEND_URL` is set correctly in Railway
2. **Connection refused**: Check that the Railway URL is correct in your frontend
3. **Authentication fails**: Verify `CONTROLLER_PASSWORD` is set correctly
4. **WebSocket errors**: Railway supports WebSockets, so this should work automatically

## Alternative Platforms

If Railway doesn't work for you, you can also deploy to:
- **Render**: Similar to Railway, supports WebSockets
- **Heroku**: Classic choice, supports WebSockets
- **DigitalOcean App Platform**: Good performance, supports WebSockets 