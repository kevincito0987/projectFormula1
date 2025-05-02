// 📦 Importar Mongoose para manejar la conexión con MongoDB
const mongoose = require("mongoose");

// 🔐 Cargar las variables de entorno desde el archivo .env
require("dotenv").config();

// 📌 Función para establecer la conexión con MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // 📜 Evita advertencias en la conexión
            useUnifiedTopology: true, // 🌐 Mejora la administración de conexiones
            bufferTimeoutMS: 30000, // ⏳ Aumenta el tiempo límite para prevenir desconexiones inesperadas
        });

        console.log("✅ ¡Conexión exitosa a MongoDB Atlas! 🏁"); // 🚀 Mensaje si la conexión es correcta
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error); // ⚠️ Captura errores y los muestra en consola
        process.exit(1); // 🔴 Termina el proceso si la conexión falla para evitar problemas en la API
    }
};

// 📦 Exportar la función de conexión para su uso en otros archivos
module.exports = { connectDB };
