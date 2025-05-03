const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");

async function connectDB() {
    try {
        console.log("🔍 Conectando a:", process.env.MONGO_URI); // 🔎 Verifica que la variable se está cargando

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ ¡Conexión exitosa a MongoDB Atlas! 🏁");
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };
