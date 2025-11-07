const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sujay@123',
  database: 'royalstay'
})

module.exports = pool.promise();