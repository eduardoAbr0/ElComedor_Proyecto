const express = require("express");
const router = express.Router();
const pool = require("./db"); // Importa base de datos

//-------------------- LOGIN - REGISTRO --------------------

//Evento log-reg
router.post("/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  const query = "SELECT * FROM empleados_lgr WHERE usuario=? && contrasena=?";

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
  const query = `INSERT INTO empleados_lgr (usuario, contrasena, tipo) 
                 VALUES (?, ?, ?)`;

  pool.query(query, [usuario, contrasena, tipo], (err, results) => {
    if (err) {
      console.error("Error al insertar empleado:", err);
      return res.status(500).send("Error al insertar el empleado");
    }
    res.status(200).send("Empleado agregado correctamente");
  });
});

//--------------------PRODUCTOS-------------------------

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

//Modificar un producto
router.put("/editar_producto/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, precio, cantidad, proveedor } = req.body;

  if (!nombre || !descripcion || !precio || !cantidad || !proveedor) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  const query = `
    UPDATE productos 
    SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?, proveedor = ?
    WHERE id = ?
  `;

  pool.query(query,[nombre, descripcion, precio, cantidad, proveedor, id],
    (err, results) => {
      if (err) {
        console.error("Error al editar el producto:", err);
        return res.status(500).send("Error al editar el producto");
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("Producto no encontrado");
      }

      res.status(200).send("Producto actualizado correctamente");
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

//--------------------MENUS-------------------------

// Obtener todos los menús
router.get("/menus", (req, res) => {
  pool.query("SELECT * FROM Menus", (err, results) => {
    if (err) {
      console.error("Error al obtener menús:", err);
      return res.status(500).send("Error al obtener menús");
    }
    res.json(results);
  });
});

// Insertar un nuevo menú
router.post("/menus", (req, res) => {
  const { nombre, descripcion, categoria, precio } = req.body;

  if (!nombre || !descripcion || !categoria || !precio) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  const query = `INSERT INTO Menus (Nombre, Descripcion, Categoria, Precio) VALUES (?, ?, ?, ?)`;

  pool.query(query, [nombre, descripcion, categoria, precio], (err, results) => {
    if (err) {
      console.error("Error al insertar el menú:", err);
      return res.status(500).send("Error al insertar el menú");
    }
    res.status(200).send("Menú insertado correctamente");
  });
});

// Modificar un menu
router.put("/menus/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, categoria, precio } = req.body;

  if (!nombre || !descripcion || !categoria || !precio) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  const query = `
    UPDATE Menus 
    SET Nombre = ?, Descripcion = ?, Categoria = ?, Precio = ?
    WHERE id = ?
  `;

  pool.query(query, [nombre, descripcion, categoria, precio, id], (err, results) => {
    if (err) {
      console.error("Error al editar el menú:", err);
      return res.status(500).send("Error al editar el menú");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Menú no encontrado");
    }

    res.status(200).send("Menú actualizado correctamente");
  });
});

// Eliminar menú 
router.delete("/menus/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM Menus WHERE id = ?";

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar el menú:", err);
      return res.status(500).send("Error al eliminar el menú");
    }
    res.status(200).send("Menú eliminado correctamente");
  });
});


module.exports = router;
