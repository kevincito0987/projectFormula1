import dotenv from "dotenv";
import mongoose from "mongoose";

// 📌 Configurar dotenv para cargar variables de entorno
dotenv.config({ path: "./.env" });

async function connectDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ La variable MONGO_URI no está definida en el archivo .env.");
        }

        console.log("🔗 Conectando a:", process.env.MONGO_URI);
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
