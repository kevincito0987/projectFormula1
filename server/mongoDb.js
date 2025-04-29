const { MongoClient } = require("mongodb");
require("dotenv").config(); // Carga las variables desde el archivo .env

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("¡Conexión exitosa a MongoDB!");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
    }
}

connectDB();

module.exports = client;
