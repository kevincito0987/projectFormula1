// 📦 Importar dotenv para manejar variables de entorno
import dotenv from "dotenv";
import mongoose from "mongoose";

// 📌 Configurar dotenv para cargar variables de entorno
dotenv.config({ path: "./server/.env" }); // ✅ Ajusta la ruta si es necesario

// 🔗 Función para conectar a la base de datos MongoDB
async function connectDB() {
    try {
        console.log("🔗 Conectando a:", process.env.MONGO_URI); // ✅ Verifica que la variable se está cargando
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ ¡Conexión exitosa a MongoDB!");
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
}

// 📦 Exportar la función de conexión
export { connectDB };
