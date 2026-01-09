# Deploying to Render.com

This guide explains how to deploy your Todo List application to Render.com.

## Prerequisites

- A GitHub account with your code pushed to a repository
- A Render.com account (free tier available)

## Deployment Steps

### 1. Deploy Backend (Server)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `todolist-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free

5. Add Environment Variables (click "Advanced"):
   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-random-jwt-secret-here-change-this
   PORT=10000
   CLIENT_URL=https://your-frontend-app-name.onrender.com
   DATABASE_PATH=./database/todolist.db
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://todolist-backend-xxxx.onrender.com`)

### 2. Deploy Frontend (Client)

1. Click "New +" and select "Static Site"
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: `todolist-frontend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-app-name.onrender.com
   ```
   **IMPORTANT**: Replace `your-backend-app-name` with your actual backend URL from Step 1

5. Click "Create Static Site"
6. Wait for deployment (3-5 minutes)

### 3. Update Backend CORS

After deploying the frontend:

1. Go to your backend service on Render
2. Go to "Environment" tab
3. Update the `CLIENT_URL` variable with your frontend URL:
   ```
   CLIENT_URL=https://your-frontend-app-name.onrender.com
   ```
4. Save changes (this will trigger a redeploy)

## Troubleshooting

### "JSON.parse: unexpected character at line 1 column 1"

This error usually means:

1. **Wrong API URL**: Check that `VITE_API_URL` in frontend environment variables matches your backend URL
2. **CORS Issue**: Make sure `CLIENT_URL` in backend matches your frontend URL
3. **Backend not running**: Check backend logs on Render dashboard

**How to fix**:
- Open browser DevTools (F12) → Network tab
- Try to use the app and see what URLs are being called
- Check if the API calls are going to the correct backend URL
- Look at the response - if it's HTML instead of JSON, the URL is wrong

### Database Issues

On Render free tier, the filesystem is ephemeral (resets on restart). For persistent data:
- Upgrade to a paid plan with persistent disk
- Or use an external database (PostgreSQL, etc.)

### Backend Takes Long to Start

Free tier services on Render sleep after 15 minutes of inactivity. First request may take 30-60 seconds.

## Environment Variables Summary

### Backend (`server`)
```
NODE_ENV=production
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
PORT=10000
CLIENT_URL=https://your-frontend-url.onrender.com
DATABASE_PATH=./database/todolist.db
```

### Frontend (`client`)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Testing Deployment

1. Visit your frontend URL
2. Open DevTools (F12) → Console
3. Try logging in or viewing the database page
4. Check for any errors in Console or Network tabs
5. Verify API calls are going to your backend URL (not localhost)

## Important Notes

- Free tier services sleep after 15 minutes of inactivity
- Database is ephemeral on free tier (data resets on restart)
- Both services redeploy automatically when you push to GitHub
- Check Render logs if something isn't working
