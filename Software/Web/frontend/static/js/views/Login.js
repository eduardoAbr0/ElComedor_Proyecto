import AbstractView from "./AbstracView.js";

export default class extends AbstractView {
  constructor() {
    super();

    this.setTitle("LOGIN");
  }

  async getHtml() {
    return `
    <div class="login-container">
      <div class="login-registro">
                  <!-- Registro -->
                  <div class="form-box" id="register-box">
                    <img src="/static/css/logo.jpeg" class="logo" alt="El Comedor Logo">
                    <h3 class="logReg-h">Crear cuenta</h3>
                    <label>Usuario</label>
                    <input type="text" id="usuario-empleado" placeholder="Ingresa nombre de usuario" />
                    <label>Contraseña</label>
                    <input type="password" id="contrasena-empleado" placeholder="Ingresa contraseña" />
                    
                    <label>Rol</label>
                    <select id="tipo-empleado">
                      <option>Manager</option>
                      <option>Empleado</option>
                    </select>
                    
                    <button class="registro_empleado">Crear</button>
                    <span class="toggle-link" id="login_click_switch" >¿Ya tienes cuenta? Inicia sesión</span>
                  </div>

                  <!-- Login -->
                  <div class="form-box hidden" id="login-box">
                    <img src="/static/css/logo.jpeg" class="logo" alt="El Comedor Logo">
                    <h3 class="logReg-h">Iniciar sesión</h3>
                    <label>Usuario</label>
                    <input type="text" id="usuario_login" placeholder="Ingresa nombre de usuario" />
                    
                    <label>Contraseña</label>
                    <input type="password" id="contrasena_login" placeholder="Ingresa contraseña" />
                    
                    <button class="login_empleado">Entrar</button>
                    <span class="toggle-link" id="registro_click_switch">¿No tienes cuenta? Crea una</span>
                  </div>
      </div>
    </div>
        `;
  }

  async afterRender() {
    const botonR = document.querySelector("button.registro_empleado");
    const botonL = document.querySelector("button.login_empleado");


    const log = document.getElementById("login_click_switch");
    const reg = document.getElementById("registro_click_switch");

    log.addEventListener("click", () => {
        document.getElementById('register-box').classList.add('hidden');
        document.getElementById('login-box').classList.remove('hidden');
      });

    reg.addEventListener("click", () => {
        document.getElementById('login-box').classList.add('hidden');
        document.getElementById('register-box').classList.remove('hidden');
      });

    // Evento para agregar empleado
    botonR?.addEventListener("click", async (e) => {
      e.preventDefault();

      const usuario = document.getElementById("usuario-empleado").value;
      const contrasena = document.getElementById("contrasena-empleado").value;
      const tipo = document.getElementById("tipo-empleado").value;

      if (!usuario || !contrasena || !tipo) {
        alert("Completa todos los campos");
        return;
      }

      const datos = {
        usuario,
        contrasena,
        tipo
      };

      try {
        const respuesta = await fetch("/api/insertar_empleado", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        });

        if (respuesta.ok) {
          alert("Se agrego empleado");
        } else {
          alert("Error al agregar empleado");
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        alert("No se pudo conectar al servidor.");
      }
    })

    // Evento para logear
    botonL?.addEventListener("click", async (e) =>{
      e.preventDefault();

      const usuario = document.getElementById("usuario_login").value;
      const contrasena = document.getElementById("contrasena_login").value;

      if (!usuario || !contrasena ) {
        alert("Completa todos los campos");
        return;
      }

      const datos = {
        usuario,
        contrasena,
      };

      try {
        const respuesta = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        });

        const data = await respuesta.json();
        if (data.success) {
          window.location.href = "/Dashboard";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        alert("No se pudo conectar al servidor.");
      }

    });
  }
}
