# Todo List - Full Stack Application

A beginner-friendly full-stack todo list application built with React, Express, SQLite, and JWT authentication. Designed for deployment on Render.com.

## Features

- User registration and authentication with JWT
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Edit todo details inline
- **Database Viewer** - View all database tables and contents without authentication
- Responsive design
- Secure password hashing with bcrypt
- Protected API routes
- Clean and modern UI
- Easy deployment to Render.com

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite (sql.js)** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
todolist/
├── client/                 # React frontend
│   ├── public/
│   │   └── _redirects     # Render SPA routing
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/      # Login & Register
│   │   │   ├── Todos/     # Todo components
│   │   │   └── Layout/    # Header & PrivateRoute
│   │   ├── context/       # AuthContext
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS files
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # JWT utilities
│   │   └── server.js      # Server entry point
│   ├── database/          # SQLite database (gitignored)
│   └── package.json
│
├── .gitignore
├── .env.example
├── package.json           # Root scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd c:/dev/todolist
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   cd ..
   ```

### Environment Variables

1. **Create server/.env**
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   CLIENT_URL=http://localhost:5173
   DATABASE_PATH=./database/todolist.db
   ```

2. **Create client/.env**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

#### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend only:**
```bash
npm run dev:server
```

**Frontend only:**
```bash
npm run dev:client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Building for Production

Build the frontend:
```bash
cd client
npm run build
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Todo Routes (`/api/todos`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/todos` | Get all user todos | Yes |
| POST | `/api/todos` | Create new todo | Yes |
| PUT | `/api/todos/:id` | Update todo | Yes |
| PATCH | `/api/todos/:id/toggle` | Toggle completed | Yes |
| DELETE | `/api/todos/:id` | Delete todo | Yes |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Deployment on Render.com

### 🚀 Quick Start

**Having issues with "JSON.parse error"?** → See [QUICK_FIX.md](./QUICK_FIX.md)

For complete deployment instructions, see:
- **📋 Step-by-step guide**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **📖 Detailed guide**: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- **🔧 Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Backend Deployment (Web Service)

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret>
   CLIENT_URL=<your-frontend-url>
   DATABASE_PATH=./database/todolist.db
   PORT=10000
   ```

### Frontend Deployment (Static Site)

1. **Create a new Static Site** on Render.com
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Set Environment Variables:**
   ```
   VITE_API_URL=<your-backend-url>
   ```

### 🧪 Testing Your Deployment

After deployment, visit: `https://your-frontend-url.onrender.com/debug.html`

This debug page will help you verify:
- Backend is accessible
- API endpoints are working
- CORS is configured correctly
- JSON responses are valid

### Important Notes for Render Deployment

- Free tier services sleep after 15 minutes of inactivity (first request takes ~30-60s)
- Database is ephemeral on free tier (resets on restart)
- For persistent data, upgrade to paid plan with persistent disk
- Both services auto-redeploy on GitHub push
- Use the debug page (`/debug.html`) to troubleshoot issues

## Usage

1. **Register a new account**
   - Navigate to `/register`
   - Enter username, email, and password
   - Automatically logs in after registration

2. **Login**
   - Navigate to `/login`
   - Enter email and password

3. **Manage Todos**
   - Add new todos with title and optional description
   - Click checkbox to mark as complete/incomplete
   - Click "Edit" to modify todo details
   - Click "Delete" to remove a todo
   - View completion stats

4. **Logout**
   - Click "Logout" button in header

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT-based authentication (7-day expiration)
- Protected API routes with middleware
- CORS configuration
- Input validation on both frontend and backend
- SQL injection prevention with parameterized queries

## Development Notes

- SQLite database uses `sql.js` (pure JavaScript, no native dependencies)
- Database automatically creates tables on first run
- Database file is saved to disk after every operation
- Frontend uses React Context API for global auth state
- Axios interceptors handle token injection and 401 errors

## Troubleshooting

### Common Issues

**"JSON.parse: unexpected character at line 1 column 1" error:**
- See [QUICK_FIX.md](./QUICK_FIX.md) for immediate solution
- Check that `VITE_API_URL` matches your backend URL
- Verify `CLIENT_URL` on backend matches your frontend URL
- Use `/debug.html` page to test API connectivity

**Database not persisting:**
- Free tier on Render has ephemeral storage (resets on restart)
- For persistence, upgrade to paid plan with persistent disk

**CORS errors:**
- Verify `CLIENT_URL` environment variable matches frontend URL exactly
- Check that API calls use correct `VITE_API_URL`
- Make sure both services redeployed after env var changes

**Authentication issues:**
- Clear localStorage and try logging in again
- Check that JWT_SECRET is set on server
- Verify token is being sent in Authorization header

**Backend takes long to respond:**
- Normal on free tier - services sleep after 15 minutes
- First request after sleeping takes 30-60 seconds

For more help, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Future Enhancements

- Todo categories/tags
- Due dates and reminders
- Search and filter functionality
- Todo priority levels
- User profile management
- Password reset functionality
- Dark mode

## License

MIT

## Contributing

This is a beginner-friendly project. Feel free to fork and modify for learning purposes!
