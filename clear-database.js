const initDb = require('./server/node_modules/sql.js');
const fs = require('fs');

const DATABASE_PATH = './server/database/todolist.db';

const createTables = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

async function clearDatabase() {
  try {
    // Check if database exists
    if (!fs.existsSync(DATABASE_PATH)) {
      console.log('❌ Database file not found at:', DATABASE_PATH);
      return;
    }

    // Initialize SQL.js
    const SQL = await initDb();

    // Load the database to get current counts
    const dbData = fs.readFileSync(DATABASE_PATH);
    const oldDb = new SQL.Database(dbData);

    const todoCount = oldDb.exec('SELECT COUNT(*) as count FROM todos');
    const todos = todoCount[0]?.values[0][0] || 0;

    const userCount = oldDb.exec('SELECT COUNT(*) as count FROM users');
    const users = userCount[0]?.values[0][0] || 0;

    oldDb.close();

    console.log(`📊 Current database contents:`);
    console.log(`   - Todos: ${todos}`);
    console.log(`   - Users: ${users}`);

    // Create a new empty database
    const db = new SQL.Database();

    // Create tables
    db.run(createTables);

    // Save to disk
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DATABASE_PATH, buffer);

    console.log(`✅ Database cleared! Created empty database with table structure.`);
    console.log(`   - Deleted ${todos} todos`);
    console.log(`   - Deleted ${users} users`);

    db.close();
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

clearDatabase();
