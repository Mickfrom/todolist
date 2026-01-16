const initDb = require('sql.js');
const fs = require('fs');
const path = require('path');

const DATABASE_PATH = process.env.DATABASE_PATH || './database/todolist.db';

let db = null;

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
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

const initDatabase = async () => {
  try {
    const SQL = await initDb();
    
    // Check if database file exists
    const dbDir = path.dirname(DATABASE_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    let dbData = null;
    if (fs.existsSync(DATABASE_PATH)) {
      dbData = fs.readFileSync(DATABASE_PATH);
    }

    db = dbData ? new SQL.Database(dbData) : new SQL.Database();
    
    // Create tables
    db.run(createTables);

    // Migration: Add status column if it doesn't exist
    try {
      const tableInfo = db.exec("PRAGMA table_info(todos)");
      const columns = tableInfo[0]?.values?.map(row => row[1]) || [];
      if (!columns.includes('status')) {
        db.run("ALTER TABLE todos ADD COLUMN status TEXT DEFAULT 'pending'");
        console.log('✅ Migration: Added status column to todos table');
      }
    } catch (migrationError) {
      console.log('Migration check skipped or failed:', migrationError.message);
    }

    // Save to disk
    saveDatabase();
    
    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DATABASE_PATH, buffer);
  }
};

// Database query wrapper
const query = (sql, params = []) => {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    
    return results;
  } catch (error) {
    throw error;
  }
};

// Database run wrapper (for INSERT, UPDATE, DELETE)
const run = (sql, params = []) => {
  try {
    db.run(sql, params);
    saveDatabase();

    // For INSERT statements, return the last inserted ID
    if (sql.trim().toUpperCase().startsWith('INSERT')) {
      const result = query('SELECT last_insert_rowid() as id');
      console.log('[DEBUG] Last insert ID query result:', JSON.stringify(result));
      if (result && result.length > 0 && result[0].id !== undefined) {
        const lastId = result[0].id;
        console.log('[DEBUG] Returning last insert ID:', lastId);
        return lastId;
      }
      console.log('[DEBUG] No ID found in result, returning null');
      return null;
    }

    // For other statements, return the number of changes
    return db.getRowsModified();
  } catch (error) {
    console.error('[ERROR] Database run error:', error);
    throw error;
  }
};

// Query one row
const queryOne = (sql, params = []) => {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
};

// Query all rows (alias for query)
const queryAll = (sql, params = []) => {
  return query(sql, params);
};

// Get last insert ID
const getLastInsertId = () => {
  return query('SELECT last_insert_rowid() as id')[0].id;
};

module.exports = {
  initDatabase,
  query,
  queryOne,
  queryAll,
  run,
  getLastInsertId,
  saveDatabase
};