const express = require("express");
const dbClient = require("./data/mongoDb");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor corriendo y conectado a MongoDB");
});

app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000"));
