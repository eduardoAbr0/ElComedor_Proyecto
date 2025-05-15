import Dashboard from "./views/Dashboard.js";
import Inventario from "./views/Inventario.js";
import Login from "./views/Login.js";
import Menu from "./views/Menu.js";
import Empleado from "./views/Empleado.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};


const router = async () => {
  const routes = [
    { path: "/", view: Login },
    { path: "/Dashboard", view: Dashboard },
    { path: "/Login", view: Login },
    { path: "/Empleados", view:  Empleado},
    { path: "/Inventario", view: Inventario },
    { path: "/Menu", view: Menu },
    { path: "/Reportes", view: () => console.log("Viewing Reportes") },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }


  const view = new match.route.view();
  console.log(location.pathname)

  //Ocultar elementos para login
  const layoutElements = document.querySelectorAll("header"); 
  if (location.pathname === "/" || location.pathname === "/Login") {
    layoutElements.forEach((el) => (el.style.display = "none"));
  } else {
    layoutElements.forEach((el) => (el.style.display = "true"));
  }

  document.querySelector("#app").innerHTML = await view.getHtml();

  if (view.afterRender) {
    await view.afterRender();
  }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});
