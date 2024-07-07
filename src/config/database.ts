// config/database.ts

import mysql from 'mysql2/promise';

//Offline database configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mobiPhones',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// On the production server, use the following configuration:
// const pool = mysql.createPool({
//   host: 'sql8.freesqldatabase.com',
//   user: 'sql8717813',
//   password: '7wH2MPKlQQ',
//   database: 'sql8717813',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

export default pool;
