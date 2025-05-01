// 🔐 Cargar variables de entorno desde el archivo .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// 📦 Importar rutas de la API
const weatherRoutes = require("./routes/weather"); // 🌦️ Datos meteorológicos
const circuitsRoutes = require("./routes/circuits"); // 🏎️ Circuitos de F1
const driversRoutes = require("./routes/drivers"); // 🏆 Pilotos de F1
const teamsRoutes = require("./routes/teams"); // 🏁 Equipos de F1
const carsRoutes = require("./routes/cars"); // 🚗 Información de los autos

const app = express();
app.use(express.json()); // 📌 Permitir intercambio de datos en formato JSON
app.use(cors()); // 🌍 Habilitar acceso CORS para evitar restricciones en el cliente

// 🚀 Definir puerto con manejo de fallback
const PORT = process.env.PORT || 5000;

// 🔗 Conectar a MongoDB con manejo de errores
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Conectado a MongoDB 📡"))
    .catch((error) => {
        console.error("❌ Error en la conexión con MongoDB:", error.message); // ⚠️ Mensaje de error en consola
        process.exit(1); // 🔴 Salir del proceso en caso de fallo
    });

// 🏎️ Definir rutas principales de la API
app.use("/api/weather", weatherRoutes); // 🌦️ Clima
app.use("/api/circuits", circuitsRoutes); // 🏁 Circuitos
app.use("/api/drivers", driversRoutes); // 🏆 Pilotos
app.use("/api/teams", teamsRoutes); // 🔧 Equipos
app.use("/api/cars", carsRoutes); // 🚗 Autos

// 🔍 Ruta principal para verificar que el servidor está activo
app.get("/", (req, res) => {
    res.send("🚀 API de Clima, Circuitos, Pilotos, Equipos y Carros F1 funcionando en localhost! 🏎️📡");
});

// 🚀 Iniciar el servidor con manejo de errores
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT} 🌍`);
}).on("error", (err) => {
    console.error(`❌ Error al iniciar el servidor: ${err.message}`);
});
