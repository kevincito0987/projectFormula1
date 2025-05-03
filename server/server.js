// 🔐 Cargar variables de entorno desde el archivo .env
import express from "express";
import cors from "cors";
import { connectDB } from "./data/mongoDb.js";

// 📦 Importar rutas de la API
import weatherRoutes from "./routes/weather.js";
import circuitsRoutes from "./routes/circuits.js";
import driversRoutes from "./routes/drivers.js";
import teamsRoutes from "./routes/teams.js";
import carsRoutes from "./routes/cars.js";
import newsRoutes from "./routes/news.js";
import sessionRoutes from "./routes/sesionsRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

// 🚀 Definir puerto con manejo de fallback
const PORT = process.env.PORT || 5000;

connectDB(); // 🔗 Conectar a la base de datos

// 🏎️ Definir rutas principales de la API
app.use("/api/weather", weatherRoutes);
app.use("/api/circuits", circuitsRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/sessions", sessionRoutes);

// 🔍 Ruta principal para verificar que el servidor está activo
app.get("/", (req, res) => {
    res.send("🚀 API funcionando en Railway! 🏎️📡");
});

// 🚀 Iniciar el servidor con manejo de errores y sincronización automática
app.listen(PORT, async () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT} 🌍`);
}).on("error", (err) => {
    console.error(`❌ Error al iniciar el servidor: ${err.message}`);
});
