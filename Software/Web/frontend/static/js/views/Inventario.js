import AbstractView from "./AbstracView.js";

export default class extends AbstractView {
  constructor() {
    super();

    this.setTitle("INVENTARIO");
  }

  async getHtml() {
    return `
                    <div class="table-container">
                    <div class="table-header">
                        <h2>Inventario</h2>
                    </div>

                    <table class="custom-table">
                        <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>DESCRIPCIÓN</th>
                            <th>PRECIO</th>
                            <th>CANTIDAD</th>
                            <th>PROVEEDOR</th>
                        </tr>
                        </thead>
                        <tbody id="tabla-cuerpo">
                        <tr>
                            <td><input type="text" id="nombre_inventario" name="nombre_inventario" required><br><br></td>
                            <td><input type="text" id="descripcion_inventario" name="descripcion_inventario" required><br><br></td>
                            <td><input type="text" id="precio_inventario" name="precio_inventario" required><br><br></td>
                            <td><input type="text" id="cantidad_inventario" name="cantidad_inventario" required><br><br></td>
                            <td><input type="text" id="proveedor_inventario" name="proveedor_inventario" required><br><br></td>

                            <td><button class="add-button">+</button></td>
                        </tr>
                        </tbody>
                    </table>
                    </div>

                    <!-- Modal de Confirmación -->
                    <div id="confirmModal" class="modal">
                        <div class="modal-content">
                            <p>¿Seguro que deseas eliminar este producto?</p>
                            <button id="confirmYes">Sí</button>
                            <button id="confirmNo">No</button>
                        </div>
                    </div>
        `;
  }

  async afterRender() {
    const boton = document.querySelector("button.add-button");

    // Evento para agregar un nuevo producto
    boton?.addEventListener("click", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre_inventario").value;
      const descripcion = document.getElementById(
        "descripcion_inventario"
      ).value;
      const precio = document.getElementById("precio_inventario").value;
      const cantidad = document.getElementById("cantidad_inventario").value;
      const proveedor = document.getElementById("proveedor_inventario").value;

      if (!nombre || !descripcion || !precio || !cantidad || !proveedor) {
        alert("Completa todos los campos");
        return;
      }

      const datos = {
        nombre,
        descripcion,
        precio,
        cantidad,
        proveedor,
      };

      try {
        const respuesta = await fetch("/api/insertar_producto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        });

        if (respuesta.ok) {
          location.reload(); // Recarga para mostrar el nuevo producto agregado
        } else {
          alert("Error al insertar el producto");
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        alert("No se pudo conectar al servidor.");
      }
    });

    // Cargar todos productos de la base de datos
    try {
      const res = await fetch("/api/productos");
      const productos = await res.json();

      const cuerpoTabla = document.getElementById("tabla-cuerpo");

      productos.forEach((prod) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                <td>${prod.nombre}</td>
                <td>${prod.descripcion}</td>
                <td>${prod.precio}</td>
                <td>${prod.cantidad}</td>
                <td>${prod.proveedor}</td>
                <td>
                    <button class="btn-edit" data-id="${prod.id}">✏️</button>
                    <button class="btn-delete" data-id="${prod.id}">🗑️</button>
                </td>
            `;
        cuerpoTabla.appendChild(fila);
      });

      // Evento para eliminar
      document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          const modal = document.getElementById("confirmModal");
          modal.style.display = "flex";

          document
            .getElementById("confirmYes")
            .addEventListener("click", () => eliminarProducto(id, e.target));
          document
            .getElementById("confirmNo")
            .addEventListener("click", cerrarModal);
        });
      });

      // Eventos para editar
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }

    // Función para mostrar el modal
    function mostrarModal() {
      const modal = document.getElementById("confirmModal");
      modal.style.display = "flex"; // Mostrar el modal
    }

    // Función para cerrar el modal
    function cerrarModal() {
      const modal = document.getElementById("confirmModal");
      modal.style.display = "none"; // Ocultar el modal
    }

    // Función para eliminar el producto
    async function eliminarProducto(id, target) {
      try {
        const res = await fetch(`/api/eliminar_producto/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          target.closest("tr").remove(); // Eliminar la fila de la tabla
          cerrarModal(); // Cerrar el modal
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Hubo un problema al eliminar el producto.");
      }
    }
  }
}
