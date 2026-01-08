const initDb = require('./server/node_modules/sql.js');
const fs = require('fs');
const path = require('path');

const DATABASE_PATH = './server/database/todolist.db';

async function clearTodos() {
  try {
    // Check if database exists
    if (!fs.existsSync(DATABASE_PATH)) {
      console.log('❌ Database file not found at:', DATABASE_PATH);
      return;
    }

    // Initialize SQL.js
    const SQL = await initDb();

    // Load the database
    const dbData = fs.readFileSync(DATABASE_PATH);
    const db = new SQL.Database(dbData);

    // Get current count
    const beforeCount = db.exec('SELECT COUNT(*) as count FROM todos');
    const count = beforeCount[0]?.values[0][0] || 0;

    console.log(`📊 Current todos count: ${count}`);

    // Delete all todos
    db.run('DELETE FROM todos');

    // Save the database
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DATABASE_PATH, buffer);

    // Verify deletion
    const afterCount = db.exec('SELECT COUNT(*) as count FROM todos');
    const newCount = afterCount[0]?.values[0][0] || 0;

    console.log(`✅ Todos cleared! Deleted ${count} todos.`);
    console.log(`📊 Remaining todos: ${newCount}`);

    // Show user count (unchanged)
    const userCount = db.exec('SELECT COUNT(*) as count FROM users');
    const users = userCount[0]?.values[0][0] || 0;
    console.log(`👥 Users preserved: ${users}`);

    db.close();
  } catch (error) {
    console.error('❌ Error clearing todos:', error);
  }
}

clearTodos();
