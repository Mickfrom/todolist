# Troubleshooting Guide

## "JSON.parse: unexpected character at line 1 column 1" Error

This error means your frontend is receiving HTML or plain text instead of JSON from the API. Here's how to fix it:

### Step 1: Use the Debug Page

1. Deploy your app to Render following [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
2. After deployment, visit: `https://your-frontend-url.onrender.com/debug.html`
3. Update the API URL field to your backend URL
4. Click each "Test" button and check the responses

### Step 2: Common Issues and Solutions

#### Issue 1: Wrong API URL

**Symptoms:**
- Network error
- "Failed to fetch"
- CORS error in console

**Solution:**
1. Check your backend service on Render dashboard
2. Copy the exact URL (e.g., `https://todolist-api-xyz.onrender.com`)
3. Update environment variable on Render:
   - Frontend → Environment → `VITE_API_URL` = your backend URL (no trailing slash)
4. Trigger a manual redeploy of the frontend

#### Issue 2: CORS Not Configured

**Symptoms:**
- CORS error in browser console
- "Access to fetch has been blocked by CORS policy"

**Solution:**
1. Go to backend service on Render → Environment
2. Add or update `CLIENT_URL`:
   ```
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```
3. Save (triggers automatic redeploy)

#### Issue 3: Backend Not Running

**Symptoms:**
- "Service Unavailable" error
- 502 or 503 status codes
- Takes very long to respond

**Solution:**
1. Check backend logs on Render dashboard
2. Look for startup errors
3. Verify environment variables are set correctly:
   - `NODE_ENV=production`
   - `JWT_SECRET=<your-secret>`
   - `CLIENT_URL=<your-frontend-url>`
   - `DATABASE_PATH=./database/todolist.db`

#### Issue 4: Free Tier Sleeping

**Symptoms:**
- First request takes 30-60 seconds
- Works fine after initial delay

**Solution:**
This is normal for Render free tier. Services sleep after 15 minutes of inactivity.
Options:
- Upgrade to paid tier
- Accept the delay on first load
- Use a service like UptimeRobot to ping your backend every 14 minutes

### Step 3: Check Browser Console

1. Open your deployed frontend
2. Press F12 to open DevTools
3. Go to "Network" tab
4. Try using the app
5. Look at failed requests:
   - **Red requests**: Failed requests - click to see details
   - **Check URL**: Is it pointing to localhost or your Render backend?
   - **Check Response**: What did the server actually return?

### Step 4: Verify Environment Variables

#### Backend Environment Variables
```bash
NODE_ENV=production
JWT_SECRET=your-secret-minimum-32-characters
PORT=10000
CLIENT_URL=https://your-frontend.onrender.com
DATABASE_PATH=./database/todolist.db
```

#### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend.onrender.com
```

**IMPORTANT**:
- No trailing slashes in URLs
- Use `https://` not `http://`
- Double-check spelling of your actual Render URLs

### Step 5: Test Locally First

Before deploying, test locally:

1. Start backend:
   ```bash
   cd server
   npm start
   ```

2. In another terminal, start frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Visit `http://localhost:5173/debug.html`
4. Test all endpoints - they should all work locally

If local works but production doesn't:
- It's a configuration issue (URLs, CORS, environment variables)

If local doesn't work:
- It's a code issue that needs fixing before deployment

## Additional Debugging Tips

### Check if Backend is Accessible

Open a new browser tab and visit:
```
https://your-backend-url.onrender.com/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

If you see HTML or an error page:
- Backend is not running correctly
- Check Render logs for errors

### Check Database Endpoints

Visit in browser:
```
https://your-backend-url.onrender.com/api/database/stats
```

Should return JSON like:
```json
{
  "users": 0,
  "todos": 0,
  "completedTodos": 0,
  "pendingTodos": 0
}
```

### Manual CORS Test

In your browser console (F12), run:
```javascript
fetch('https://your-backend-url.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If you get CORS error:
- `CLIENT_URL` is not set correctly on backend
- Backend needs redeployment after changing environment variables

## Still Having Issues?

1. Check Render logs for both services
2. Use the debug page (`/debug.html`)
3. Verify all URLs are correct (no localhost, no trailing slashes)
4. Make sure you're using `https://` not `http://`
5. Clear browser cache and try again
6. Try in incognito/private browsing mode

## Success Checklist

✓ Backend deployed and showing "Service running" on Render
✓ Frontend deployed successfully
✓ Backend `/health` endpoint returns JSON
✓ Backend environment variables set correctly
✓ Frontend environment variable `VITE_API_URL` points to backend
✓ Backend `CLIENT_URL` points to frontend
✓ No CORS errors in browser console
✓ Debug page tests pass
✓ Can access `/database` page and see data
