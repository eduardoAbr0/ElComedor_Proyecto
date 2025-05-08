const mysql = require('mysql2');

// Configura conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',      
  user: 'root',            
  password: 'pizzaplaneta',  
  database: 'prueba_comedor',  
  connectionLimit: 10
});

module.exports = pool;