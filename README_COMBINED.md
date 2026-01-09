# Todo List - Combined Deployment Branch

This is the **combined deployment** branch that merges client and server into a single service, eliminating CORS issues entirely!

## 🚀 Quick Start

**Want to deploy on Render.com?** Follow [RENDER_SETUP_COMBINED.md](./RENDER_SETUP_COMBINED.md)

## What's Different?

This branch differs from `main` in these ways:

### ✅ Benefits

1. **No CORS Configuration** - Everything runs on same domain
2. **Single Service** - Deploy once, not twice
3. **Simpler Setup** - No need to coordinate frontend/backend URLs
4. **Single URL** - Everything at `https://your-app.onrender.com`

### 🔧 Technical Changes

1. **Server serves React build**
   ```javascript
   // server/src/server.js
   app.use(express.static('../../client/dist'));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
   });
   ```

2. **API URLs use relative paths**
   ```javascript
   // client/src/services/api.js
   baseURL: '' // Instead of 'http://localhost:5000'
   ```

3. **Combined build script**
   ```bash
   ./render-build.sh
   # Builds client, then installs server deps
   ```

## Local Development

### Production-like (Combined)

```bash
# Build everything
./build.sh

# Start server (serves built React app)
cd server
npm start

# Visit http://localhost:5000
```

### Development mode (Separate, faster)

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client with hot reload
cd client
npm run dev

# Visit http://localhost:5173
```

## Deployment on Render

See **[RENDER_SETUP_COMBINED.md](./RENDER_SETUP_COMBINED.md)** for step-by-step instructions.

**TL;DR:**
1. Create Web Service on Render
2. Select `combined-deployment` branch
3. Build: `./render-build.sh`
4. Start: `cd server && node src/server.js`
5. Add 4 environment variables (no CORS vars needed!)

## Documentation

- **[RENDER_SETUP_COMBINED.md](./RENDER_SETUP_COMBINED.md)** - Step-by-step Render deployment
- **[COMBINED_DEPLOYMENT.md](./COMBINED_DEPLOYMENT.md)** - Technical details
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues (from main branch)

## Switching Branches

### To deploy combined (this branch):
```bash
git checkout combined-deployment
```

### To deploy separately (original):
```bash
git checkout main
```

## When to Use This Branch

**✅ Use combined deployment when:**
- You want simplest possible deployment
- CORS is causing problems
- You're deploying to one platform (Render, Heroku, etc.)
- You don't need CDN for frontend

**❌ Use separate deployment (`main` branch) when:**
- You want frontend on CDN for better performance
- You want to scale frontend and backend independently
- You're using different platforms for frontend/backend

## Environment Variables

Only 4 variables needed (no CORS configuration!):

```bash
NODE_ENV=production
JWT_SECRET=your-long-random-secret-key
DATABASE_PATH=./database/todolist.db
PORT=10000
```

## File Structure

```
todolist/
├── client/                    # React frontend
│   ├── dist/                 # Built files (gitignored)
│   └── src/
├── server/                    # Express backend
│   └── src/
│       └── server.js         # Serves API + static files
├── render-build.sh           # Build script for Render
├── build.sh                  # Local build script
└── RENDER_SETUP_COMBINED.md  # Deployment guide
```

## FAQ

**Q: Will my data persist?**
A: Not on free tier. Upgrade to paid plan for persistent storage.

**Q: Do I need two services on Render?**
A: No! Just one Web Service.

**Q: What about CORS?**
A: No CORS needed - everything same domain!

**Q: Can I still use the database viewer?**
A: Yes! Visit `/database` on your deployed app.

**Q: How do I update my deployed app?**
A: Just push to `combined-deployment` branch - auto-deploys.

## Support

- See [RENDER_SETUP_COMBINED.md](./RENDER_SETUP_COMBINED.md) for deployment help
- See [COMBINED_DEPLOYMENT.md](./COMBINED_DEPLOYMENT.md) for technical details
- Check Render logs if something goes wrong
- Open GitHub issue for bugs

---

**Live Demo:** Deploy your own using [RENDER_SETUP_COMBINED.md](./RENDER_SETUP_COMBINED.md)!
