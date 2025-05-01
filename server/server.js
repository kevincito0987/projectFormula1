require("dotenv").config(); // Cargar variables de entorno desde .env
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Importar rutas correctamente
const weatherRoutes = require("./routes/weather");
const circuitsRoutes = require("./routes/circuits"); // ✅ Circuitos agregados
const driversRoutes = require("./routes/drivers"); // ✅ Pilotos agregados
const teamsRoutes = require("./routes/teams"); // ✅ Equipos agregados
const carsRoutes = require("./routes/cars"); // ✅ Nueva ruta para carros

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

// Rutas de la API (clima, circuitos, pilotos, equipos y carros)
app.use("/api/weather", weatherRoutes);
app.use("/api/circuits", circuitsRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/cars", carsRoutes); // ✅ Carros agregados

// Ruta principal para verificar que el servidor está activo
app.get("/", (req, res) => {
    res.send("🚀 API de Clima, Circuitos, Pilotos, Equipos y Carros F1 funcionando en localhost! 🏎️📡");
});

// Iniciar el servidor con manejo de errores
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
}).on("error", (err) => {
    console.error(`❌ Error al iniciar el servidor: ${err.message}`);
});
