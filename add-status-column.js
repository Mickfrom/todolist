const initDb = require('./server/node_modules/sql.js');
const fs = require('fs');

const DATABASE_PATH = './server/database/todolist.db';

async function addStatusColumn() {
  try {
    if (!fs.existsSync(DATABASE_PATH)) {
      console.log('❌ Database file not found at:', DATABASE_PATH);
      return;
    }

    const SQL = await initDb();
    const dbData = fs.readFileSync(DATABASE_PATH);
    const db = new SQL.Database(dbData);

    console.log('📊 Adding status column to todos table...');

    // Add status column with default value 'pending'
    try {
      db.run("ALTER TABLE todos ADD COLUMN status TEXT DEFAULT 'pending'");
      console.log('✅ Status column added successfully');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('ℹ️  Status column already exists');
      } else {
        throw error;
      }
    }

    // Update existing todos to have 'done' status if they're completed
    db.run("UPDATE todos SET status = 'done' WHERE completed = 1");
    db.run("UPDATE todos SET status = 'pending' WHERE completed = 0 AND status IS NULL");

    // Save database
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DATABASE_PATH, buffer);

    console.log('✅ Database migration completed successfully');

    // Show todos count by status
    const stats = db.exec('SELECT status, COUNT(*) as count FROM todos GROUP BY status');
    if (stats.length > 0) {
      console.log('\n📊 Todos by status:');
      stats[0].values.forEach(row => {
        console.log(`   - ${row[0]}: ${row[1]}`);
      });
    }

    db.close();
  } catch (error) {
    console.error('❌ Error adding status column:', error);
  }
}

addStatusColumn();
