# Environment Variables Setup Guide

## 📁 Files Created

### 1. `server/.env` (Local Development)
This file is already set up for local development. It's in your project but NOT committed to Git.

**Current values:**
```env
NODE_ENV=development
JWT_SECRET=my-super-secret-jwt-key-change-this-in-production-12345
DATABASE_PATH=./database/todolist.db
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 2. `server/.env.example` (Template)
Template file committed to Git showing what variables are needed.

### 3. `server/.env.production` (Production Template)
Template for production values. Do NOT commit with real secrets!

---

## 🚀 For Render.com Deployment

You don't use the `.env` files on Render. Instead, set these as **Environment Variables** in the Render Dashboard:

### Step 1: Go to Render Dashboard
1. Navigate to your Web Service
2. Click **"Environment"** tab in left sidebar

### Step 2: Add These 4 Variables

Click "Add Environment Variable" and add each one:

#### Variable 1: NODE_ENV
```
Key:   NODE_ENV
Value: production
```

#### Variable 2: JWT_SECRET
```
Key:   JWT_SECRET
Value: [Generate a random 32+ character string]
```
💡 Generate at: https://randomkeygen.com/ (use "Fort Knox Passwords" or "CodeIgniter Encryption Keys")

Example: `a8f5f167f44f4964e6c998dee827110c-32chars-or-more`

#### Variable 3: DATABASE_PATH
```
Key:   DATABASE_PATH
Value: ./database/todolist.db
```

#### Variable 4: PORT
```
Key:   PORT
Value: 10000
```

### Step 3: Save
After adding all 4 variables, Render will automatically redeploy your service.

---

## 💻 For Local Development

Your `server/.env` file is already set up. To test locally:

```bash
# Build the client
cd client
npm run build

# Start the server (serves both API and client)
cd ../server
npm start

# Visit http://localhost:5000
```

---

## 🔒 Security Notes

### What's Committed to Git:
- ✅ `server/.env.example` - Template (no secrets)
- ❌ `server/.env` - Your local config (gitignored)
- ❌ `server/.env.production` - Production template (gitignored)

### Production Security:
- Never commit real `JWT_SECRET` values
- Use different secrets for development and production
- Generate strong, random secrets (32+ characters)
- Rotate secrets periodically

---

## 🎯 Quick Reference

### Development (.env file)
```env
NODE_ENV=development
JWT_SECRET=local-dev-secret-ok-to-be-simple
DATABASE_PATH=./database/todolist.db
PORT=5000
```

### Production (Render Dashboard)
```env
NODE_ENV=production
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c-strong-random-secret
DATABASE_PATH=./database/todolist.db
PORT=10000
```

---

## ❓ FAQ

**Q: Do I need VITE_API_URL or CLIENT_URL?**
A: No! Combined deployment doesn't need these. Everything runs on the same domain.

**Q: Where is the .env file for the client?**
A: Not needed! The client uses relative URLs (empty baseURL in api.js).

**Q: Can I use the same JWT_SECRET for dev and production?**
A: You can, but it's better to use different secrets for security.

**Q: What if I change JWT_SECRET on Render?**
A: All existing user tokens will be invalidated. Users will need to log in again.

**Q: The .env file isn't working on Render!**
A: Render doesn't use .env files. You must set variables in the Dashboard → Environment tab.

---

## 🐛 Troubleshooting

**"JWT_SECRET is not defined" error:**
- Check Render Dashboard → Environment
- Make sure JWT_SECRET is set
- Check logs for other errors

**Database errors:**
- Verify DATABASE_PATH is exactly: `./database/todolist.db`
- Check file permissions in logs

**Port errors:**
- On Render, use PORT=10000
- Locally, you can use PORT=5000

**Still having issues?**
- Check Render logs
- Verify all 4 variables are set
- Try manual redeploy: Settings → Manual Deploy → Deploy Latest Commit

---

## 📚 Related Documentation

- [RENDER_SETUP_COMBINED.md](./RENDER_SETUP_COMBINED.md) - Complete deployment guide
- [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Variable reference
- [COMBINED_DEPLOYMENT.md](./COMBINED_DEPLOYMENT.md) - Technical details
