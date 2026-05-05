const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbPromise;

const initDb = async () => {
  try {
    dbPromise = open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    const db = await dbPromise;
    await db.exec(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        output_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

const pool = {
  query: async (text, params) => {
    const db = await dbPromise;
    let sqliteText = text;
    if (params) {
      // Replace $1, $2 with ? for sqlite
      params.forEach((p, i) => {
        sqliteText = sqliteText.replace(`$${i + 1}`, '?');
      });
    }

    if (sqliteText.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await db.all(sqliteText, params || []);
      return { rows };
    } else {
      let isReturning = false;
      if (sqliteText.toUpperCase().includes('RETURNING *')) {
        sqliteText = sqliteText.replace(/RETURNING \*/i, '');
        isReturning = true;
      }
      
      const result = await db.run(sqliteText, params || []);
      
      if (isReturning) {
        const row = await db.get('SELECT * FROM requests WHERE id = ?', [result.lastID]);
        return { rows: [row] };
      }
      return { rows: [] };
    }
  }
};

module.exports = { pool, initDb };
