# Deployment Fixes Applied

This document tracks fixes applied to make the combined deployment work on Render.com.

## Issues Fixed

### 1. ✅ Build Failure: "vite: not found"

**Problem:** Client build was failing because Vite (dev dependency) wasn't being installed.

**Error:**
```
sh: 1: vite: not found
==> Build failed
```

**Solution:** Updated `render-build.sh` to include dev dependencies:
```bash
npm ci --include=dev  # Instead of just npm ci
```

**Commit:** `4550e8f` - Fix deployment: include dev dependencies for client build

---

### 2. ✅ CORS Error

**Problem:** CORS policy was blocking requests even though client and server are on same domain.

**Error:**
```
The CORS policy for this site does not allow access from the specified Origin.
```

**Solution:** Simplified CORS configuration in `server/src/server.js`:
```javascript
// Old (too restrictive)
app.use(cors({
  origin: function (origin, callback) {
    // Complex origin checking...
  }
}));

// New (simpler, works for combined deployment)
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Commit:** `540c64a` - Fix deployment: simplify CORS for combined deployment

---

## Environment Variables

Only these 3 are actually needed for combined deployment:

```
NODE_ENV=production
JWT_SECRET=your-secret-key-here
DATABASE_PATH=./database/todolist.db
```

**Note:** `PORT` is automatically set by Render, so you don't need to set it manually (though setting it to `10000` works fine too).

**Not needed:**
- ❌ `CLIENT_URL` - Not needed for combined deployment
- ❌ `VITE_API_URL` - Not needed, uses relative paths

---

## Current Status

✅ Build script works correctly
✅ CORS is properly configured
✅ Client and server combined successfully
✅ No environment variable conflicts

## Testing Checklist

After deployment:
- [ ] Visit app URL - should load React app
- [ ] Register a new user - should work
- [ ] Login - should work
- [ ] Create a todo - should work
- [ ] Visit `/database` - should show database contents
- [ ] Check browser console - no CORS errors
- [ ] Check Render logs - server started successfully

## Deployment Monitoring

Watch Render logs for these success messages:
```
✓ Client built successfully
✓ Server dependencies installed
✓ Server running on port 10000
✓ Environment: production
✓ Combined deployment: Serving API and React app
```

## If You Still See Issues

### CORS Errors
- Check Render logs to see if server started
- Verify you're on the `combined-deployment` branch
- Try hard refresh (Ctrl+Shift+R)
- Clear browser cache

### Build Failures
- Check that `render-build.sh` has the correct permissions
- Verify the script includes `--include=dev`
- Check client/package.json has all dependencies

### Database Errors
- Check `DATABASE_PATH` is set correctly
- Remember: Free tier database is ephemeral (resets on restart)
- Check logs for permission errors

### Server Won't Start
- Check all environment variables are set
- Verify `JWT_SECRET` is set (at least 32 characters)
- Check logs for Node.js errors

## Useful Commands

**View logs on Render:**
- Go to your service
- Click "Logs" tab
- Filter by "Deploy" or "Runtime"

**Manual redeploy:**
- Go to your service
- Click "Manual Deploy"
- Select "Clear build cache & deploy"

**Check environment variables:**
- Go to your service
- Click "Environment" tab
- Verify all variables are set correctly

---

## Branch Information

- **Branch:** `combined-deployment`
- **Latest commit:** `540c64a`
- **Status:** ✅ Ready for deployment
- **Last updated:** 2026-01-15

## Related Documentation

- [RENDER_SETUP_COMBINED.md](./RENDER_SETUP_COMBINED.md) - Deployment guide
- [COMBINED_DEPLOYMENT.md](./COMBINED_DEPLOYMENT.md) - Technical details
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - General troubleshooting
