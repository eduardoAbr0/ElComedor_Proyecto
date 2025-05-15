import AbstractView from "./AbstracView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("MENÚS");
  }

  async getHtml() {
    return `
            <div class="table-container">
                <div class="table-header">
                    <h2>Menús</h2>
                </div>

                <table class="custom-table">
                <thead>
                    <tr>
                    <th>NOMBRE</th>
                    <th>DESCRIPCIÓN</th>
                    <th>CATEGORÍA</th>
                    <th>PRECIO</th>
                    </tr>
                </thead>
                <tbody id="tabla-cuerpo">
                    <tr>
                    <td><input type="text" id="nombre_menu" name="nombre_menu" required><br><br></td>
                    <td><input type="text" id="descripcion_menu" name="descripcion_menu" required><br><br></td>
                    <td><input type="text" id="categoria_menu" name="categoria_menu" required><br><br></td>
                    <td><input type="text" id="precio_menu" name="precio_menu" required><br><br></td>
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

    // Agregar menu
    boton?.addEventListener("click", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre_menu").value;
      const descripcion = document.getElementById("descripcion_menu").value;
      const categoria = document.getElementById("categoria_menu").value;
      const precio = document.getElementById("precio_menu").value;

      if (!nombre || !descripcion || !categoria || !precio) {
        alert("Completa todos los campos");
        return;
      }

      const datos = { nombre, descripcion, categoria, precio };

      try {
        const respuesta = await fetch("/api/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        if (respuesta.ok) {
          location.reload();
        } else {
          alert("Error al insertar el menú");
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        alert("No se pudo conectar al servidor.");
      }
    });

    // Cargar todos los menús
    try {
      const res = await fetch("/api/menus");
      const menus = await res.json();

      const cuerpoTabla = document.getElementById("tabla-cuerpo");

      menus.forEach((menu) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><input type="text" class="editable" value="${menu.nombre}" data-id="${menu.id}" data-field="nombre"></td>
            <td><input type="text" class="editable" value="${menu.descripcion}" data-id="${menu.id}" data-field="descripcion"></td>
            <td><input type="text" class="editable" value="${menu.categoria}" data-id="${menu.id}" data-field="categoria"></td>
            <td><input type="text" class="editable" value="${menu.precio}" data-id="${menu.id}" data-field="precio"></td>
            
            <div class="botones_registros">
                <button class="btn-edit" data-id="${menu.id}">✏️</button>
                <button class="btn-eliminar" data-id="${menu.id}">🗑️</button>
            </div>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
      });

      // Editar menú
      document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          const inputs = document.querySelectorAll(`input[data-id="${id}"]`);
          const menu = {};

          inputs.forEach((input) => {
            const campo = input.getAttribute("data-field");
            const valor = input.value;
            menu[campo] = valor;
          });

          const modal = document.getElementById("confirmModal");
          modal.style.display = "flex";
          const confirmYes = document.getElementById("confirmYes");
          const confirmNo = document.getElementById("confirmNo");

          confirmYes.replaceWith(confirmYes.cloneNode(true));
          confirmNo.replaceWith(confirmNo.cloneNode(true));

          document
            .getElementById("confirmYes")
            .addEventListener("click", () => editarMenu(id, menu));
          document.getElementById("confirmNo").addEventListener("click", cerrarModal);
        });
      });

      // Función para editar menú
      async function editarMenu(id, datos) {
        try {
          const res = await fetch(`/api/menus/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
          });

          if (res.ok) {
            alert("Menú actualizado correctamente");
            cerrarModal();
            location.reload();
          } else {
            alert("Error al actualizar el menú");
          }
        } catch (err) {
          console.error("Error al actualizar:", err);
          alert("Ocurrió un error al intentar actualizar.");
        }
      }

      // Eliminar menú
      document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          const modal = document.getElementById("confirmModal");
          modal.style.display = "flex";
          const confirmYes = document.getElementById("confirmYes");
          const confirmNo = document.getElementById("confirmNo");

          confirmYes.replaceWith(confirmYes.cloneNode(true));
          confirmNo.replaceWith(confirmNo.cloneNode(true));

          document
            .getElementById("confirmYes")
            .addEventListener("click", () => eliminarMenu(id, e.target));
          document.getElementById("confirmNo").addEventListener("click", cerrarModal);
        });
      });
    } catch (err) {
      console.error("Error al cargar menús:", err);
    }
    //Funcion para eliminar menú
    async function eliminarMenu(id, target) {
      try {
        const res = await fetch(`/api/menus/${id}`, { method: "DELETE" });
        if (res.ok) {
          target.closest("tr").remove();
          cerrarModal();
        } else {
          alert("Error al eliminar el menú");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Hubo un problema al eliminar el menú.");
      }
    }

    function cerrarModal() {
      const modal = document.getElementById("confirmModal");
      modal.style.display = "none";
    }
  }
}
