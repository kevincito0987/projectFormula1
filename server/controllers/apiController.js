const axios = require("axios");
const Piloto = require("../models/piloto.js");

async function fetchAndSavePilotos() {
    try {
        const response = await axios.get("https://f1api.dev/api/drivers?limit=10&offset=20", {
            headers: { Authorization: `Bearer ${process.env.F1_API_KEY}` },
        });

        console.log("Respuesta de la API:", response.data); 

        const pilotos = response.data.data || [];

        if (!Array.isArray(pilotos)) {
            throw new Error("La estructura de los datos no es un array");
        }

        for (const piloto of pilotos) {
            const nuevoPiloto = new Piloto({
                id: piloto.id,
                nombre: piloto.nombre || "Desconocido",
                equipo: piloto.equipo || "Equipo desconocido",
                rol: piloto.rol || "Sin rol definido",
                estadisticas: piloto.stats || {},
            });
            await nuevoPiloto.save();
        }
        console.log("¡Pilotos guardados en MongoDB!");
    } catch (error) {
        console.error("Error al obtener o guardar pilotos:", error);
    }
}

module.exports = { fetchAndSavePilotos };
