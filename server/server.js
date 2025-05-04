// 🔐 Cargar variables de entorno desde el archivo .env
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./data/mongoDb");
const { syncIndexedDBToMongo } = require("./data/indexedDb");

// 📦 Importar rutas de la API
const weatherRoutes = require("./routes/weather"); // 🌦️ Datos meteorológicos
const circuitsRoutes = require("./routes/circuits"); // 🏎️ Circuitos de F1
const driversRoutes = require("./routes/drivers"); // 🏆 Pilotos de F1
const teamsRoutes = require("./routes/teams"); // 🏁 Equipos de F1
const carsRoutes = require("./routes/cars"); // 🚗 Información de los autos
const newsRoutes = require("./routes/news"); // 📰 Noticias de F1
const sessionRoutes = require("./routes/sessionsRoutes"); // 🔐 Manejo de sesiones

const app = express();
app.use(express.json()); // 📌 Permitir intercambio de datos en formato JSON
app.use(cors()); // 🌍 Habilitar acceso CORS para evitar restricciones en el cliente

// 🚀 Definir puerto con manejo de fallback
const PORT = process.env.PORT || 5000;

connectDB(); // 🔗 Conectar a la base de datos

// 🏎️ Definir rutas principales de la API
app.use("/api/weather", weatherRoutes); // 🌦️ Clima
app.use("/api/circuits", circuitsRoutes); // 🏁 Circuitos
app.use("/api/drivers", driversRoutes); // 🏆 Pilotos
app.use("/api/teams", teamsRoutes); // 🔧 Equipos
app.use("/api/cars", carsRoutes); // 🚗 Autos
app.use("/api/news", newsRoutes); // 📰 Noticias
app.use("/api/sessions", sessionRoutes); // 🔐 Sesiones

// 🔍 Ruta principal para verificar que el servidor está activo
app.get("/", (req, res) => {
    res.send("🚀 API de Clima, Circuitos, Pilotos, Equipos y Carros F1 funcionando en localhost! 🏎️📡");
});

// 🚀 Iniciar el servidor con manejo de errores y sincronización automática
app.listen(PORT, async () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT} 🌍`);

    // 🔄 Sincronizar sesiones de IndexedDB con MongoDB Atlas al iniciar
    await syncIndexedDBToMongo("admin");
    await syncIndexedDBToMongo("user");
}).on("error", (err) => {
    console.error(`❌ Error al iniciar el servidor: ${err.message}`);
});
