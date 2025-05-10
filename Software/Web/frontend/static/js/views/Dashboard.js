import AbstractView from "./AbstracView.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("EL COMEDOR");
    }

    async getHtml() {
        return `
            <section class="port">
            <div class="port-cont">
                <h1>BIENVENIDO</h1>
                <h3>
                El Comedor - Punto Gastronómico especializado en la elaboración de desayunos. Ofreciendo de igual forma un menú variado de comida típica regional mexicana, cortes selectos y platillos gourmet, brindando una experiencia culinaria única en un ambiente de restaurante-bar.
                </h3>
            </div>
            </section>

            <footer>
            <p>
                <a href="#">Soporte</a>
            </p>
            </footer>
        `;
    }
}