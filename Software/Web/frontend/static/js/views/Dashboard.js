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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis
                turpis rhoncus, scelerisque purus ultrices, sollicitudin dolor.
                Vestibulum elementum luctus diam tincidunt ultricies. Nulla varius,
                est sed iaculis pharetra, enim risus fringilla arcu, ac consequat diam
                nulla vel eros. Ut bibendum eros eros. Nunc posuere, ligula et congue
                sodales, mauris turpis euismod turpis, in semper purus neque quis
                justo. Nunc mollis pharetra augue sed pretium. Ut tempor feugiat magna
                sed aliquam. Maecenas mi est, congue sed feugiat non, faucibus vitae
                lectus. Integer tincidunt a dui aliquam suscipit. Ut tempor ligula
                volutpat nibh cursus convallis. Curabitur consectetur ultrices
                posuere.
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