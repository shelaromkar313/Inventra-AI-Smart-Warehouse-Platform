const fs = require('fs');
const path = require('path');
const db = require('./db');

const initDb = async () => {
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Initializing database...');
    await db.query(sql);
    console.log('Database initialized successfully.');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  initDb();
}

module.exports = initDb;
