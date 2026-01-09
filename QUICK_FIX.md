# Quick Fix for "JSON.parse: unexpected character at line 1 column 1"

## 🚨 This error means: **Your frontend can't talk to your backend**

## ✅ Quick Fix Steps

### 1. Get Your Backend URL
- Go to Render Dashboard → Your backend service
- Copy the URL (looks like: `https://todolist-api-xyz.onrender.com`)

### 2. Update Frontend Environment Variable
- Go to Render Dashboard → Your frontend service → Environment
- Find or add: `VITE_API_URL`
- Set value to: `https://your-backend-url.onrender.com` (NO trailing slash!)
- Click "Save Changes"

### 3. Get Your Frontend URL
- Go to Render Dashboard → Your frontend service
- Copy the URL (looks like: `https://todolist-frontend-xyz.onrender.com`)

### 4. Update Backend Environment Variable
- Go to Render Dashboard → Your backend service → Environment
- Find or add: `CLIENT_URL`
- Set value to: `https://your-frontend-url.onrender.com` (NO trailing slash!)
- Click "Save Changes"

### 5. Wait & Test
- Wait 2-3 minutes for both services to redeploy
- Visit: `https://your-frontend-url.onrender.com/debug.html`
- Click "Test /health" - should show ✓ Success
- Click "Test /api/database/stats" - should show ✓ Success

## ❌ Still Not Working?

### Check These Common Mistakes:

1. **Wrong URL format**
   - ✅ Correct: `https://my-app.onrender.com`
   - ❌ Wrong: `https://my-app.onrender.com/` (trailing slash)
   - ❌ Wrong: `http://my-app.onrender.com` (http instead of https)
   - ❌ Wrong: `localhost:5000` (localhost in production!)

2. **Backend not running**
   - Go to backend service on Render
   - Check logs for errors
   - Should see: "✓ Server running on port 10000"

3. **Using old cached version**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Try in incognito/private mode
   - Hard refresh (Ctrl+Shift+R)

## 🔧 Test Your Backend Directly

Open in new browser tab:
```
https://your-backend-url.onrender.com/health
```

Should return:
```json
{"status":"ok","message":"Server is running"}
```

If you see HTML or error:
- Your backend is not running properly
- Check Render logs for errors

## 📝 Environment Variables Checklist

### Backend Service (`todolist-api`):
- ✅ `NODE_ENV` = `production`
- ✅ `JWT_SECRET` = any random string (min 32 chars)
- ✅ `CLIENT_URL` = your frontend URL from step 3
- ✅ `PORT` = `10000`
- ✅ `DATABASE_PATH` = `./database/todolist.db`

### Frontend Service (`todolist-frontend`):
- ✅ `VITE_API_URL` = your backend URL from step 1

## 🎯 How to Know It's Fixed

1. Visit `/debug.html` on your frontend
2. All test buttons show green ✓ Success
3. Visit `/database` on your frontend
4. See actual database tables and data
5. No errors in browser console (F12)

---

**Need more help?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
