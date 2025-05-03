// 🔐 Cargar variables de entorno desde el archivo .env
import express from "express";
import cors from "cors";
import { connectDB } from "./data/mongoDb.js";
import { syncIndexedDBToMongo } from "./data/indexedDb.js"; // ✅ Importar funciones directamente con ES Modules

// 📦 Importar rutas de la API
import weatherRoutes from "./routes/weather.js"; // 🌦️ Datos meteorológicos
import circuitsRoutes from "./routes/circuits.js"; // 🏎️ Circuitos de F1
import driversRoutes from "./routes/drivers.js"; // 🏆 Pilotos de F1
import teamsRoutes from "./routes/teams.js"; // 🏁 Equipos de F1
import carsRoutes from "./routes/cars.js"; // 🚗 Información de los autos
import newsRoutes from "./routes/news.js"; // 📰 Noticias de F1
import sessionRoutes from "./routes/sesionsRoutes.js"; // 🔐 Manejo de sesiones

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
    res.send("🚀 API funcionando en Railway! 🏎️📡");
});

// 🚀 Iniciar el servidor con manejo de errores y sincronización automática
app.listen(PORT, async () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT} 🌍`);

    // 🔄 Sincronizar sesiones de IndexedDB con MongoDB Atlas al iniciar
    if (syncIndexedDBToMongo) {
        await syncIndexedDBToMongo("admin");
        await syncIndexedDBToMongo("user");
    } else {
        console.error("❌ Error: syncIndexedDBToMongo no está definido.");
    }
}).on("error", (err) => {
    console.error(`❌ Error al iniciar el servidor: ${err.message}`);
});
