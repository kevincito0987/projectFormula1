const axios = require("axios");
const { connectDB } = require("./data/mongoDb.js");
const Piloto = require("./models/piloto");

async function fetchAndSavePilotos() {
    try {
        await connectDB(); // Conectar a MongoDB

        // Consumir la primera API (info básica de pilotos)
        const response1 = await axios.get("https://f1connectapi.vercel.app/api/drivers?limit=20&offset=20");
        console.log("Primera API - Respuesta:", response1.data);

        const pilotosBase = response1.data.drivers;

        if (!Array.isArray(pilotosBase)) {
            throw new Error("Estructura inesperada de la primera API: No es un array");
        }

        // Consumir la segunda API (info con URLs de imágenes)
        const response2 = await axios.get("https://api.openf1.org/v1/drivers");
        console.log("Segunda API - Respuesta:", response2.data);

        const pilotosImagenes = response2.data; // Ajusta según la estructura de la API

        if (!Array.isArray(pilotosImagenes)) {
            throw new Error("Estructura inesperada de la segunda API: No es un array");
        }

        // Combinar datos de ambas APIs
        const pilotosCombinados = pilotosBase.map((pilotoBase) => {
            // Buscar el piloto en la segunda API por driver number, nombre y apellido
            const pilotoImagen = pilotosImagenes.find(
                (pImagen) =>
                    pImagen.driver_number === pilotoBase.number || // Comparar por número de coche
                    (pImagen.first_name === pilotoBase.name && pImagen.last_name === pilotoBase.surname) // Comparar por nombre
            );

            return {
                driverId: pilotoBase.driverId || null,
                nombre: pilotoBase.name || "Desconocido",
                apellido: pilotoBase.surname || "Sin apellido",
                nacionalidad: pilotoBase.nationality || "Sin nacionalidad",
                fechaNacimiento: pilotoBase.birthday || "Sin fecha",
                numero: pilotoBase.number || null,
                nombreCorto: pilotoBase.shortName || "Sin nombre corto",
                url: pilotoImagen ? pilotoImagen.headshot_url : "Sin URL", // Agregar URL de imagen si existe
            };
        });

        // Guardar en MongoDB
        for (const piloto of pilotosCombinados) {
            const nuevoPiloto = new Piloto(piloto);
            await nuevoPiloto.save();
            console.log(`Piloto guardado: ${nuevoPiloto.nombre} ${nuevoPiloto.apellido}`);
        }

        console.log("¡Todos los pilotos con imágenes han sido guardados en MongoDB!");
    } catch (error) {
        console.error("Error al obtener o guardar pilotos:", error);
    }
}

fetchAndSavePilotos();
