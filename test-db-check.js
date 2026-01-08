const initDb = require('./server/node_modules/sql.js');
const fs = require('fs');
const bcrypt = require('./server/node_modules/bcryptjs');

const DATABASE_PATH = './server/database/todolist.db';

async function checkDatabase() {
  try {
    const SQL = await initDb();

    if (!fs.existsSync(DATABASE_PATH)) {
      console.log('❌ Database file does not exist at:', DATABASE_PATH);
      return;
    }

    const dbData = fs.readFileSync(DATABASE_PATH);
    const db = new SQL.Database(dbData);

    // Get all users
    const stmt = db.prepare('SELECT id, username, email, password_hash FROM users');
    const users = [];
    while (stmt.step()) {
      users.push(stmt.getAsObject());
    }
    stmt.free();

    console.log('📊 Users in database:');
    console.log(JSON.stringify(users, null, 2));

    if (users.length > 0) {
      console.log('\n🔍 Checking password hashes:');
      for (const user of users) {
        console.log(`\nUser: ${user.username}`);
        console.log(`Password hash exists: ${!!user.password_hash}`);
        console.log(`Hash length: ${user.password_hash ? user.password_hash.length : 0}`);
        console.log(`Hash starts with $2a$ or $2b$: ${user.password_hash ? user.password_hash.startsWith('$2') : false}`);

        // Test password comparison
        if (user.password_hash) {
          const testPassword = 'test123'; // Try common test password
          try {
            const isValid = await bcrypt.compare(testPassword, user.password_hash);
            console.log(`Test password 'test123' valid: ${isValid}`);
          } catch (e) {
            console.log(`Error comparing password: ${e.message}`);
          }
        }
      }
    }

    db.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabase();
