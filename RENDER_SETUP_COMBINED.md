# Quick Setup: Combined Deployment on Render

## ✨ This eliminates ALL CORS issues!

Follow these steps to deploy your todo list app on Render.com as a single service.

## Step-by-Step Instructions

### 1. Go to Render Dashboard

Visit https://dashboard.render.com/

### 2. Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**

### 3. Connect Repository

1. Click **"Connect a repository"** or choose from your connected repos
2. Select your repository: **Mickfrom/todolist**
3. **IMPORTANT**: Select branch **`combined-deployment`** (not main!)

### 4. Configure Service

Fill in these settings:

**Basic Settings:**
- **Name**: `todolist-app` (or any name you want)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `combined-deployment` ⚠️ IMPORTANT!
- **Root Directory**: Leave **blank** (empty)
- **Runtime**: Node
- **Build Command**: `./render-build.sh`
- **Start Command**: `cd server && node src/server.js`

**Instance Type:**
- Select **"Free"**

### 5. Add Environment Variables

Click **"Advanced"** or scroll down to **Environment Variables**.

Add these 4 variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `make-this-a-long-random-string-at-least-32-characters` |
| `DATABASE_PATH` | `./database/todolist.db` |
| `PORT` | `10000` |

**Notes:**
- For `JWT_SECRET`, use a random string (you can generate one at https://randomkeygen.com/)
- You do NOT need `CLIENT_URL` or `VITE_API_URL` - no CORS!

### 6. Create Service

1. Click **"Create Web Service"** button
2. Wait 5-10 minutes for build and deployment
3. Watch the logs - you should see:
   ```
   ==> Building client...
   ✓ Client built successfully
   ==> Installing server dependencies...
   ✓ Server dependencies installed
   ==> Build complete!
   ```

### 7. Test Your App

Once deployment shows **"Live"** (green status):

1. **Click on your app URL** (e.g., `https://todolist-app-xxxx.onrender.com`)
2. You should see the todo list app!
3. Test the database viewer: add `/database` to URL
4. Test health check: add `/health` to URL

## ✅ Success Checklist

- [ ] Service shows "Live" status (green)
- [ ] Can visit app URL and see login page
- [ ] Can register a new account
- [ ] Can login
- [ ] Can create todos
- [ ] Can visit `/database` page and see data
- [ ] No CORS errors in browser console (F12)

## 🎉 You're Done!

Your app is now running at: `https://your-app-name.onrender.com`

Everything works from one URL - no CORS configuration needed!

## 📝 Important Notes

### Free Tier Limitations

- **Sleeping**: Service sleeps after 15 minutes of inactivity
  - First request takes 30-60 seconds to wake up
  - Subsequent requests are fast

- **Ephemeral Storage**: Database resets when service restarts
  - This happens on every deploy
  - For persistent data, upgrade to paid plan ($7/month)

### Auto-Deploy

- Push to `combined-deployment` branch → Auto-deploys
- Push to `main` branch → Does NOT deploy (different branch)

### Updating Your App

1. Make changes locally
2. Test with:
   ```bash
   ./build.sh
   cd server && npm start
   # Visit http://localhost:5000
   ```
3. Commit changes:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin combined-deployment
   ```
4. Render automatically rebuilds and deploys!

## 🐛 Troubleshooting

### Build fails

**Check Render logs.** Common issues:
- Wrong branch selected (should be `combined-deployment`)
- Build script permissions (should be fixed automatically)
- Client build errors - check your React code

### App loads but blank page

1. Check browser console (F12) for errors
2. Check Render logs
3. Try visiting `/health` - should return JSON

### Can't login/register

1. Check `JWT_SECRET` is set
2. Check server logs on Render
3. Try clearing browser cache

### Database empty

- Normal on free tier after restart/redeploy
- Data is not persistent on free tier
- Upgrade to paid plan for persistent disk

## 💰 Cost

- **Free tier**: $0/month
  - 750 hours/month of runtime
  - Service sleeps after 15 min inactivity
  - No persistent storage

- **Starter tier**: $7/month
  - Always on
  - 512 MB RAM
  - Can add persistent disk (+$1/GB/month)

## 🔗 Useful Links

- Your app: `https://your-app-name.onrender.com`
- Database viewer: `https://your-app-name.onrender.com/database`
- Health check: `https://your-app-name.onrender.com/health`
- Render dashboard: https://dashboard.render.com/
- Documentation: See [COMBINED_DEPLOYMENT.md](./COMBINED_DEPLOYMENT.md)

---

**Need help?** Open an issue on GitHub or check the deployment logs on Render.
