const initDb = require('./server/node_modules/sql.js');
const fs = require('fs');

const DATABASE_PATH = './server/database/todolist.db';

async function checkTodos() {
  try {
    if (!fs.existsSync(DATABASE_PATH)) {
      console.log('❌ Database file not found');
      return;
    }

    const SQL = await initDb();
    const dbData = fs.readFileSync(DATABASE_PATH);
    const db = new SQL.Database(dbData);

    // Get all todos
    const allTodos = db.exec('SELECT * FROM todos');

    console.log('\n📊 All Todos:');
    if (allTodos.length > 0 && allTodos[0].values.length > 0) {
      console.log('Columns:', allTodos[0].columns.join(', '));
      allTodos[0].values.forEach((row, idx) => {
        console.log(`\nTodo ${idx + 1}:`);
        allTodos[0].columns.forEach((col, i) => {
          console.log(`  ${col}: ${row[i]}`);
        });
      });
    } else {
      console.log('No todos found');
    }

    // Count by status
    const stats = db.exec('SELECT status, COUNT(*) as count FROM todos GROUP BY status');
    console.log('\n📈 Status counts:');
    if (stats.length > 0 && stats[0].values.length > 0) {
      stats[0].values.forEach(row => {
        console.log(`  ${row[0]}: ${row[1]}`);
      });
    } else {
      console.log('  No todos with status');
    }

    db.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTodos();
