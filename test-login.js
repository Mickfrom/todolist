const bcrypt = require('./server/node_modules/bcryptjs');
const initDb = require('./server/node_modules/sql.js');
const fs = require('fs');

async function testLogin() {
  const username = process.argv[2] || 'anna';
  const password = process.argv[3] || 'password123';

  try {
    const SQL = await initDb();
    const dbData = fs.readFileSync('./server/database/todolist.db');
    const db = new SQL.Database(dbData);

    // Find user
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind([username]);

    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();

    if (!user) {
      console.log(`❌ User '${username}' not found`);
      return;
    }

    console.log(`✅ User found: ${user.username} (ID: ${user.id})`);
    console.log(`📝 Password hash from DB: ${user.password_hash}`);

    // Test password comparison
    console.log(`\n🔐 Testing password: "${password}"`);
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log(`Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

    db.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
