const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Database file path
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../database/todolist.db');

let db = null;

/**
 * Initialize the SQLite database
 * Creates tables if they don't exist
 */
async function initDatabase() {
  try {
    const SQL = await initSqlJs();

    // Check if database file exists
    const dbDir = path.dirname(DATABASE_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Load existing database or create new one
    if (fs.existsSync(DATABASE_PATH)) {
      const buffer = fs.readFileSync(DATABASE_PATH);
      db = new SQL.Database(buffer);
      console.log('Database loaded from:', DATABASE_PATH);
    } else {
      db = new SQL.Database();
      console.log('New database created');
    }

    // Create tables
    createTables();

    // Save database to file
    saveDatabase();

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/**
 * Create database tables if they don't exist
 */
function createTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Todos table
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables created/verified');
}

/**
 * Save database to file
 */
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DATABASE_PATH, buffer);
  }
}

/**
 * Get database instance
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Execute a query and return results
 */
function query(sql, params = []) {
  const db = getDatabase();
  const result = db.exec(sql, params);
  saveDatabase(); // Save after each query
  return result;
}

/**
 * Execute a query and return a single row
 */
function queryOne(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  stmt.bind(params);

  let row = null;
  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    row = {};
    columns.forEach((col, index) => {
      row[col] = values[index];
    });
  }

  stmt.free();
  saveDatabase();
  return row;
}

/**
 * Execute a query and return all rows
 */
function queryAll(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  stmt.bind(params);

  const rows = [];
  while (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    const row = {};
    columns.forEach((col, index) => {
      row[col] = values[index];
    });
    rows.push(row);
  }

  stmt.free();
  return rows;
}

/**
 * Run a query that modifies data (INSERT, UPDATE, DELETE)
 */
function run(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDatabase();
}

/**
 * Get the last inserted row ID
 */
function getLastInsertId() {
  const db = getDatabase();
  const result = db.exec("SELECT last_insert_rowid() as id");
  return result[0]?.values[0]?.[0] || null;
}

module.exports = {
  initDatabase,
  getDatabase,
  saveDatabase,
  query,
  queryOne,
  queryAll,
  run,
  getLastInsertId
};
