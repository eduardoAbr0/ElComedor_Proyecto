// backend/api.js
const express = require('express');
const router = express.Router();
const pool = require('./db');  // Importa la configuración de la base de datos

//Evento cosulta de todos productos
router.get('/productos', (req, res) => {
  pool.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).send('Error al obtener productos');
    }
    res.json(results);
  });
});

// Evento agregar producto
router.post('/insertar_producto', (req, res) => {
  const { nombre, descripcion, precio, cantidad, proveedor } = req.body;

  // Asegúrate de validar que todos los campos estén presentes
  if (!nombre || !descripcion || !precio || !cantidad || !proveedor) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  // Consulta SQL para insertar el nuevo producto
  const query = `INSERT INTO productos (nombre, descripcion, precio, cantidad, proveedor) 
                 VALUES (?, ?, ?, ?, ?)`;

  pool.query(query, [nombre, descripcion, precio, cantidad, proveedor], (err, results) => {
    if (err) {
      console.error('Error al insertar el producto:', err);
      return res.status(500).send('Error al insertar el producto');
    }
    res.status(200).send('Producto insertado correctamente');
  });
});

// Eliminar producto por ID
router.delete('/eliminar_producto/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM productos WHERE id = ?';

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      return res.status(500).send('Error al eliminar el producto');
    }
    res.status(200).send('Producto eliminado correctamente');
  });
});

module.exports = router;