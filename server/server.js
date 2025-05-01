require("dotenv").config(); // Cargar variables de entorno desde .env
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Importar rutas
const weatherRoutes = require("./models/weather");

const app = express();
app.use(express.json());
app.use(cors());

// Definir puerto con manejo de fallback
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB con manejo de errores
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((error) => {
        console.error("❌ Error en la conexión con MongoDB:", error.message);
        process.exit(1); // Salir del proceso en caso de fallo
    });

// Rutas de la API
app.use("/api/weather", weatherRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.send("🚀 API de Clima F1 funcionando en localhost! 🌎📡");
});

// Iniciar el servidor con manejo de errores
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
}).on("error", (err) => {
    console.error(`❌ Error al iniciar el servidor: ${err.message}`);
});
