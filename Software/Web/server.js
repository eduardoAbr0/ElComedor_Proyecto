const express = require("express");
const path = require("path");
const session = require("express-session");
const app = express();


app.use(session({
    secret: "olej", 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));

app.use(express.urlencoded({ extended: true }));  // manejar datos urlencoded
app.use(express.json()); //manejar datos JSON

// Rutas del backend
const backendRoute = require('./backend/api');
app.use('/api', backendRoute);  // Todas rutas definidas en api.js disponibles bajo '/api'

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));
app.get("/{*any}",(req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend","index.html"));
});

// Iniciar el servidor
app.listen(process.env.PORT || 3000, () => console.log("Server ejecutando..."));
