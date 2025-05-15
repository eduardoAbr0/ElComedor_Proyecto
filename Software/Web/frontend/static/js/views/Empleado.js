import AbstractView from "./AbstracView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("EMPLEADOS");
  }

  async getHtml() {
    return `
      <div class="table-container">
        <div class="table-header">
          <h2>Empleados</h2>
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>PUESTO</th>
              <th>ÁREA</th>
              <th>TELÉFONO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody id="tabla-cuerpo">
            <tr>
              <td><input type="text" id="nombre_empleado" required></td>
              <td><input type="text" id="apellido_empleado" required></td>
              <td><input type="text" id="puesto_empleado" required></td>
              <td><input type="text" id="area_empleado" required></td>
              <td><input type="text" id="telefono_empleado" required></td>
              <td><button class="add-button">+</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="confirmModal" class="modal">
        <div class="modal-content">
          <p>¿Está seguro de su acción?</p>
          <button id="confirmYes">Sí</button>
          <button id="confirmNo">No</button>
        </div>
      </div>
    `;
  }

  //Insertar empleado
  async afterRender() {
    const boton = document.querySelector(".add-button");

    boton?.addEventListener("click", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre_empleado").value;
      const apellido = document.getElementById("apellido_empleado").value;
      const puesto = document.getElementById("puesto_empleado").value;
      const area = document.getElementById("area_empleado").value;
      const telefono = document.getElementById("telefono_empleado").value;

      if (!nombre || !apellido || !puesto || !area || !telefono) {
        alert("Completa todos los campos");
        return;
      }

      const datos = { nombre, apellido, puesto, area, telefono };

      console.log(datos);

      try {
        const respuesta = await fetch("/api/insertar_empleado", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        if (respuesta.ok) {
          location.reload();
        } else {
          alert("Error al insertar el empleado");
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        alert("No se pudo conectar al servidor.");
      }
    });

    // Cargar todos los empleados
    try {
      const res = await fetch("/api/empleados");
      const empleados = await res.json();
      const cuerpoTabla = document.getElementById("tabla-cuerpo");

      empleados.forEach((emp) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td><input type="text" class="editable" value="${emp.nombre}" data-id="${emp.id}" data-field="nombre"></td>
          <td><input type="text" class="editable" value="${emp.apellido}" data-id="${emp.id}" data-field="apellido"></td>
          <td><input type="text" class="editable" value="${emp.puesto}" data-id="${emp.id}" data-field="puesto"></td>
          <td><input type="text" class="editable" value="${emp.area}" data-id="${emp.id}" data-field="area"></td>
          <td><input type="text" class="editable" value="${emp.telefono}" data-id="${emp.id}" data-field="telefono"></td>
          <td>
            <div class="botones_registros">
              <button class="btn-edit" data-id="${emp.id}">✏️</button>
              <button class="btn-eliminar" data-id="${emp.id}">🗑️</button>
            </div>
          </td>
        `;
        cuerpoTabla.appendChild(fila);
      });

      // EDITAR
      document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          const inputs = document.querySelectorAll(`input[data-id="${id}"]`);

          const empleado = {};
          inputs.forEach((input) => {
            const campo = input.getAttribute("data-field");
            empleado[campo] = input.value;
          });

          const modal = document.getElementById("confirmModal");
          modal.style.display = "flex";
          confirmYes.replaceWith(confirmYes.cloneNode(true));
          confirmNo.replaceWith(confirmNo.cloneNode(true));

          document
            .getElementById("confirmYes")
            .addEventListener("click", () => editarEmpleado(id, empleado));
          document
            .getElementById("confirmNo")
            .addEventListener("click", cerrarModal);
        });
      });

      async function editarEmpleado(id, datos) {
        try {
          const res = await fetch(`/api/editar_empleado/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
          });

          if (res.ok) {
            alert("Empleado actualizado correctamente");
            cerrarModal();
            location.reload();
          } else {
            alert("Error al actualizar el empleado");
          }
        } catch (err) {
          console.error("Error al actualizar:", err);
          alert("Ocurrió un error al intentar actualizar.");
        }
      }

      // ELIMINAR
      document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          const modal = document.getElementById("confirmModal");
          modal.style.display = "flex";
          confirmYes.replaceWith(confirmYes.cloneNode(true));
          confirmNo.replaceWith(confirmNo.cloneNode(true));

          document
            .getElementById("confirmYes")
            .addEventListener("click", () => eliminarEmpleado(id, e.target));
          document
            .getElementById("confirmNo")
            .addEventListener("click", cerrarModal);
        });
      });

      async function eliminarEmpleado(id, target) {
        try {
          const res = await fetch(`/api/eliminar_empleado/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            target.closest("tr").remove();
            cerrarModal();
          } else {
            alert("Error al eliminar el empleado");
          }
        } catch (err) {
          console.error("Error al eliminar:", err);
          alert("Hubo un problema al eliminar el empleado.");
        }
      }

      function cerrarModal() {
        const modal = document.getElementById("confirmModal");
        modal.style.display = "none";
      }
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
  }
}
