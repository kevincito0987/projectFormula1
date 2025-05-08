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

// 🔄 **Configuración avanzada de CORS**
const corsOptions = {
    origin: "*", // 🚀 Permitir cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 🏁 Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    exposedHeaders: ["Content-Length"],
};

app.use(cors(corsOptions)); // ✅ Aplicar configuración de CORS

// 🔄 **Manejo de CORS global en todas las solicitudes**
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // 🔓 Permitir acceso desde cualquier dominio
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Origin");
    next();
});

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

// 🔄 **Manejo de preflight requests (OPTIONS)**
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Origin");
    res.sendStatus(200);
});

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
