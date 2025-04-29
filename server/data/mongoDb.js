const { MongoClient } = require("mongodb");
require("dotenv").config();

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

module.exports = { client, connectDB };
