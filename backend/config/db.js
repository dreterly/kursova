
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "qwerty123123",
  database: "petfinder",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;