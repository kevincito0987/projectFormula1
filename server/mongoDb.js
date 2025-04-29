const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb+srv://kenpachi:Sierra11709@formula1.kswfy5u.mongodb.net/?retryWrites=true&w=majority&appName=formula1";

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
