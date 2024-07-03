// config/database.ts

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'fdb33.awardspace.net',
  user: '4142759_genx',
  password: 'Genx@123',
  database: '4142759_genx',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
