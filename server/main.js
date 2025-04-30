const axios = require("axios");
const { connectDB } = require("./data/mongoDb.js"); // Asegúrate de que la ruta es correcta
const Piloto = require("./models/piloto"); // Modelo de Pilotos

async function fetchAndSavePilotos() {
    try {
        // Conectar a la base de datos
        const db = await connectDB();

        // Consumir la API de pilotos
        const response = await axios.get("https://f1connectapi.vercel.app/api/drivers?limit=20&offset=20");
        console.log("Respuesta de la API:", response.data); // Inspecciona los datos

        // Accede a la propiedad "drivers", que contiene los datos que necesitas
        const pilotos = response.data.drivers;

        if (!Array.isArray(pilotos)) {
            throw new Error("Estructura inesperada de la API: No es un array");
        }

        // Iterar y guardar cada piloto en la base de datos
        for (const piloto of pilotos) {
            const nuevoPiloto = new Piloto({
                driverId: piloto.driverId || null,
                nombre: piloto.name || "Desconocido",
                apellido: piloto.surname || "Sin apellido",
                nacionalidad: piloto.nationality || "Sin nacionalidad",
                fechaNacimiento: piloto.birthday || "Sin fecha",
                numero: piloto.number || null,
                nombreCorto: piloto.shortName || null,
                url: piloto.url || "Sin URL",
            });

            await nuevoPiloto.save(); // Guardar en MongoDB
            console.log(`Piloto guardado: ${nuevoPiloto.nombre} ${nuevoPiloto.apellido}`);
        }

        console.log("¡Todos los pilotos han sido guardados en MongoDB!");
    } catch (error) {
        console.error("Error al obtener o guardar pilotos:", error);
    } finally {
        console.log("Cerrando la conexión a la base de datos...");
    }
}

fetchAndSavePilotos();
