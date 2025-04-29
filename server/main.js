const express = require("express");
const dbClient = require("./data/mongoDb.js"); // Conexión a MongoDB

const app = express();
app.use(express.json()); // Middleware para manejar JSON

// Ruta principal
app.get("/", (req, res) => {
    res.send("Servidor corriendo y conectado a MongoDB");
});

// Endpoint para pruebas con IndexedDB
app.get("/test-indexeddb", (req, res) => {
    res.send("Aquí podrías manejar lógica de IndexedDB en el cliente.");
});

// Servidor escuchando
app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000"));
