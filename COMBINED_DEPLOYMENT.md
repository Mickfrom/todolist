# Combined Deployment Guide

This branch combines the client and server into a single deployment, eliminating CORS issues.

## How It Works

- The Express server serves the built React app as static files
- All API routes are under `/api/*`
- Frontend routes are handled by React Router
- Everything runs on a single domain (no CORS needed!)

## Local Development

### Option 1: Combined (Production-like)

1. Build the client:
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. Run the server (which serves the built client):
   ```bash
   cd server
   npm start
   ```

3. Visit `http://localhost:5000`

### Option 2: Separate (Faster for development)

1. Run server:
   ```bash
   cd server
   npm run dev
   ```

2. In another terminal, run client:
   ```bash
   cd client
   npm run dev
   ```

3. Visit `http://localhost:5173`

## Deployment on Render.com

### Single Web Service Deployment

1. **Create a new Web Service** on Render.com

2. **Connect your GitHub repository** and select the `combined-deployment` branch

3. **Configure the service:**
   - **Name**: `todolist-app` (or your preferred name)
   - **Root Directory**: Leave blank (root of repo)
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `cd server && node src/server.js`
   - **Instance Type**: Free

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key-minimum-32-characters-long
   DATABASE_PATH=./database/todolist.db
   PORT=10000
   ```

5. **Click "Create Web Service"**

6. **Wait 5-10 minutes** for deployment

7. **Test your deployment:**
   - Visit `https://your-app-name.onrender.com`
   - Should see the React app
   - Visit `https://your-app-name.onrender.com/health`
   - Should see `{"status":"ok","message":"Server is running"}`

## Benefits of Combined Deployment

✅ **No CORS issues** - Everything on same domain
✅ **Single service** - Easier to manage
✅ **Simpler configuration** - No need to coordinate two services
✅ **Lower cost** - Only one service to pay for

## File Structure

```
todolist/
├── client/                 # React app
│   ├── dist/              # Built files (served by Express)
│   └── src/
├── server/                # Express server
│   └── src/
│       └── server.js      # Serves both API and static files
├── render-build.sh        # Build script for Render
└── build.sh              # Local build script
```

## How the Server Works

```javascript
// 1. API routes come first
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/database', databaseRoutes);

// 2. Serve static files from React build
app.use(express.static('../../client/dist'));

// 3. Send all other requests to React (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
```

## Troubleshooting

### Build Fails on Render

Check Render logs. Common issues:
- Missing `render-build.sh` file
- Build script not executable (should be fixed by git)
- Client build errors - check client code

### App loads but API calls fail

1. Check that API calls use `/api/` prefix
2. Check server logs on Render
3. Visit `/health` endpoint to verify server is running

### Database issues

- Free tier: Database resets on restart (ephemeral storage)
- For persistence: Upgrade to paid plan

## Environment Variables

Only need these for the server (no frontend env vars needed):

```bash
NODE_ENV=production
JWT_SECRET=your-secret-key-here
DATABASE_PATH=./database/todolist.db
PORT=10000
```

No `CLIENT_URL` or `VITE_API_URL` needed since everything is same domain!

## Updating the Deployment

1. Make changes locally
2. Test locally with `./build.sh` then `cd server && npm start`
3. Commit and push to the `combined-deployment` branch
4. Render automatically rebuilds and deploys

## Switching Between Deployments

### From Separate to Combined:
- Use this branch (`combined-deployment`)
- Delete the separate frontend Static Site on Render
- Keep or update the backend Web Service with new build commands

### From Combined to Separate:
- Switch back to `main` branch
- Deploy frontend as Static Site
- Deploy backend as Web Service
- Set up CORS and environment variables

## Notes

- This deployment is simpler and recommended for most use cases
- The server must rebuild when client code changes
- Slightly slower deploys than separate static site
- But eliminates all CORS configuration headaches!
