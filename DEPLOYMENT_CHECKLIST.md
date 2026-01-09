# Render.com Deployment Checklist

Use this checklist to ensure proper deployment to Render.com.

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] All changes are committed
- [ ] Local testing works (`npm start` in both client and server)
- [ ] Local `/debug.html` page shows all tests passing

## Backend Deployment

- [ ] Created new Web Service on Render
- [ ] Connected to GitHub repository
- [ ] Set Root Directory to: `server`
- [ ] Set Build Command to: `npm install`
- [ ] Set Start Command to: `node src/server.js`
- [ ] Added environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=<random-32-char-string>`
  - [ ] `PORT=10000`
  - [ ] `DATABASE_PATH=./database/todolist.db`
  - [ ] `CLIENT_URL=<will-set-after-frontend-deployed>`
- [ ] Service deployed successfully
- [ ] **COPIED BACKEND URL** (e.g., `https://todolist-api-xyz.onrender.com`)
- [ ] Tested `/health` endpoint in browser returns JSON
- [ ] Checked logs show "Server running on port 10000"

## Frontend Deployment

- [ ] Created new Static Site on Render
- [ ] Connected to GitHub repository
- [ ] Set Root Directory to: `client`
- [ ] Set Build Command to: `npm install && npm run build`
- [ ] Set Publish Directory to: `dist`
- [ ] Added environment variable:
  - [ ] `VITE_API_URL=<backend-url-from-above>`
- [ ] Service deployed successfully
- [ ] **COPIED FRONTEND URL** (e.g., `https://todolist-frontend-xyz.onrender.com`)

## Post-Deployment Configuration

- [ ] Updated backend `CLIENT_URL` environment variable with frontend URL
- [ ] Backend redeployed automatically after env var change
- [ ] Waited 2-3 minutes for both services to be ready

## Testing

- [ ] Visit `https://<your-frontend-url>.onrender.com/debug.html`
- [ ] Test /health button shows ✓ Success
- [ ] Test /api/database/tables button shows ✓ Success
- [ ] Test /api/database/stats button shows ✓ Success
- [ ] Visit main app at `https://<your-frontend-url>.onrender.com`
- [ ] Can navigate to `/database` page
- [ ] Can see database tables and data
- [ ] No errors in browser console (F12)
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can view todos page
- [ ] Can create a new todo
- [ ] Database viewer updates with new data

## Common Issues Checklist

If something doesn't work, check:

- [ ] All URLs use `https://` (not `http://`)
- [ ] No trailing slashes in environment variable URLs
- [ ] Backend service shows "Running" status on Render
- [ ] Frontend service shows "Live" status on Render
- [ ] Environment variables match exactly (no typos)
- [ ] Both services redeployed after env var changes
- [ ] Checked logs on both services for errors
- [ ] Tried in incognito/private browsing mode
- [ ] Cleared browser cache

## Final Verification

### Backend Health Check
```
Visit: https://your-backend-url.onrender.com/health
Expected: {"status":"ok","message":"Server is running"}
```

### Database Stats Check
```
Visit: https://your-backend-url.onrender.com/api/database/stats
Expected: {"users":0,"todos":0,"completedTodos":0,"pendingTodos":0}
```

### Frontend Check
```
Visit: https://your-frontend-url.onrender.com
Expected: Todo list login page loads without errors
```

### Debug Page Check
```
Visit: https://your-frontend-url.onrender.com/debug.html
Expected: All tests pass with green checkmarks
```

## Notes

- Free tier services sleep after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- Database is ephemeral on free tier (resets on restart)
- Both services auto-deploy when you push to GitHub

---

## Environment Variables Reference

### Backend (`server`)
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
PORT=10000
CLIENT_URL=https://your-frontend-url.onrender.com
DATABASE_PATH=./database/todolist.db
```

### Frontend (`client`)
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

## Support Files

- **Quick fix guide**: [QUICK_FIX.md](./QUICK_FIX.md)
- **Detailed troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Full deployment guide**: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- **Debug page**: Visit `/debug.html` on your deployed frontend
