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
                            <p>¿Está seguro de su acción?</p>
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
                <td><input type="text" class="editable" value="${prod.nombre}" data-id="${prod.id}" data-field="nombre"></td>
                <td><input type="text" class="editable" value="${prod.descripcion}" data-id="${prod.id}" data-field="descripcion"></td>
                <td><input type="text" class="editable" value="${prod.precio}" data-id="${prod.id}" data-field="precio"></td>
                <td><input type="text" class="editable" value="${prod.cantidad}" data-id="${prod.id}" data-field="cantidad"></td>
                <td><input type="text" class="editable" value="${prod.proveedor}" data-id="${prod.id}" data-field="proveedor"></td>

                <div class="botones_registros">
                    <button class="btn-edit" data-id="${prod.id}">✏️</button>
                    <button class="btn-eliminar" data-id="${prod.id}">🗑️</button>
                </div>
                </td>
            `;
        cuerpoTabla.appendChild(fila);
      });

      // Evento para modificar
      document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");

          // Buscar todos los inputs relacionados con el id
          const inputs = document.querySelectorAll(`input[data-id="${id}"]`);

          const producto= {};

          inputs.forEach((input) => {
            const campo = input.getAttribute("data-field");
            const valor = input.value;
            producto[campo] = valor;
          });

          const modal = document.getElementById("confirmModal");
          modal.style.display = "flex";
          confirmYes.replaceWith(confirmYes.cloneNode(true));
          confirmNo.replaceWith(confirmNo.cloneNode(true));

          document
            .getElementById("confirmYes")
            .addEventListener("click", () => editarProducto(id, producto));
          document
            .getElementById("confirmNo")
            .addEventListener("click", cerrarModal);
        });
      });

      // Función para editar producto
      async function editarProducto(id, datos) {
        try {
          const res = await fetch(`/api/editar_producto/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
          });

          if (res.ok) {
            alert("Producto actualizado correctamente");
            cerrarModal();
          } else {
            console.log(res.status);
            alert("Error al actualizar el producto");
          }
        } catch (err) {
          console.error("Error al actualizar:", err);
          alert("Ocurrió un error al intentar actualizar.");
        }
      }

      // Evento para eliminar
      document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          const modal = document.getElementById("confirmModal");
          modal.style.display = "flex";
          confirmYes.replaceWith(confirmYes.cloneNode(true));
          confirmNo.replaceWith(confirmNo.cloneNode(true));

          document
            .getElementById("confirmYes")
            .addEventListener("click", () => eliminarProducto(id, e.target));
          document
            .getElementById("confirmNo")
            .addEventListener("click", cerrarModal);
        });
      });
    } catch (err) {
      console.error("Error al cargar productos:", err);
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
  }
}
