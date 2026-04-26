import fs from 'fs';
import path from 'path';
import * as db from './db';

const initDb = async (): Promise<void> => {
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Initializing database (TS)...');
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

export default initDb;
