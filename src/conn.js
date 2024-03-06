import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'db',
  user: 'user',
  database: 'erblog',
  password: '12345',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
