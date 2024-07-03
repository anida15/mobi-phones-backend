// config/database.ts

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'sql8.freesqldatabase.com',
  user: 'sql8717813',
  password: '7wH2MPKlQQ',
  database: 'sql8717813',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
