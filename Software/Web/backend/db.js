// backend/db.js
const mysql = require('mysql2');

// Configura tu conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',      // Dirección del servidor MySQL
  user: 'root',           // Tu usuario de MySQL
  password: 'pizzaplaneta',   // Tu contraseña de MySQL
  database: 'prueba_comedor',  // El nombre de tu base de datos
  connectionLimit: 10
});

module.exports = pool;