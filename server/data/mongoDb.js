const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferTimeoutMS: 30000, // Aumenta el tiempo límite a 30 segundos
        });
        console.log("¡Conexión exitosa a MongoDB Atlas!");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
        process.exit(1); // Termina el proceso si no se conecta
    }
};

module.exports = {connectDB};
