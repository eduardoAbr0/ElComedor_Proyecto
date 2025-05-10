const express = require("express");
const router = express.Router();
const pool = require("./db"); // Importa base de datos

//Evento log-reg
router.post("/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  const query = "SELECT * FROM empleados WHERE usuario=? && contrasena=?";

  pool.query(query, [usuario, contrasena], (err, results) => {
    if (err) {
      console.error("Error al logear:", err);
      return res.status(500).send("Error al logear");
    }

    if (results.length > 0) {
      return res.json({ success: true, message: "Login correcto" });
    } else {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }
  });

});

//Evento ingresar empleado
router.post("/insertar_empleado", (req, res) => {
  const { usuario, contrasena, tipo } = req.body;

  if (!usuario || !contrasena || !tipo) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  // Consulta SQL para insertar empleado
  const query = `INSERT INTO empleados (usuario, contrasena, tipo) 
                 VALUES (?, ?, ?)`;

  pool.query(query, [usuario, contrasena, tipo], (err, results) => {
    if (err) {
      console.error("Error al insertar empleado:", err);
      return res.status(500).send("Error al insertar el empleado");
    }
    res.status(200).send("Empleado agregado correctamente");
  });
});

//Evento cosulta de todos productos
router.get("/productos", (req, res) => {
  pool.query("SELECT * FROM productos", (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).send("Error al obtener productos");
    }
    res.json(results);
  });
});

// Evento agregar producto
router.post("/insertar_producto", (req, res) => {
  const { nombre, descripcion, precio, cantidad, proveedor } = req.body;

  if (!nombre || !descripcion || !precio || !cantidad || !proveedor) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  // Consulta SQL para insertar el nuevo producto
  const query = `INSERT INTO productos (nombre, descripcion, precio, cantidad, proveedor) 
                 VALUES (?, ?, ?, ?, ?)`;

  pool.query(
    query,
    [nombre, descripcion, precio, cantidad, proveedor],
    (err, results) => {
      if (err) {
        console.error("Error al insertar el producto:", err);
        return res.status(500).send("Error al insertar el producto");
      }
      res.status(200).send("Producto insertado correctamente");
    }
  );
});

// Eliminar producto por ID
router.delete("/eliminar_producto/:id", (req, res) => {
  const id = req.params.id;

  // Consulta SQL para eliminar producto
  const query = "DELETE FROM productos WHERE id = ?";

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar el producto:", err);
      return res.status(500).send("Error al eliminar el producto");
    }
    res.status(200).send("Producto eliminado correctamente");
  });
});

module.exports = router;
