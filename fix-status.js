const initDb = require('./server/node_modules/sql.js');
const fs = require('fs');

const DATABASE_PATH = './server/database/todolist.db';

async function fixStatus() {
  try {
    if (!fs.existsSync(DATABASE_PATH)) {
      console.log('❌ Database file not found');
      return;
    }

    const SQL = await initDb();
    const dbData = fs.readFileSync(DATABASE_PATH);
    const db = new SQL.Database(dbData);

    console.log('🔧 Fixing status field based on completed field...');

    // Update status to 'done' where completed = 1
    db.run("UPDATE todos SET status = 'done' WHERE completed = 1");

    // Update status to 'pending' where completed = 0 and status = 'done'
    db.run("UPDATE todos SET status = 'pending' WHERE completed = 0 AND status = 'done'");

    // Save database
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DATABASE_PATH, buffer);

    console.log('✅ Status field fixed!');

    // Show updated stats
    const stats = db.exec('SELECT status, COUNT(*) as count FROM todos GROUP BY status');
    console.log('\n📈 Updated status counts:');
    if (stats.length > 0 && stats[0].values.length > 0) {
      stats[0].values.forEach(row => {
        console.log(`  ${row[0]}: ${row[1]}`);
      });
    }

    db.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixStatus();
