const axios = require("axios");
const { connectDB } = require("./data/mongoDb.js");
const Piloto = require("./models/piloto");

async function fetchAndSavePilotos() {
    try {
        await connectDB(); // Conectar a MongoDB

        // Consumir la primera API (info básica de pilotos)
        const response1 = await axios.get("https://f1api.dev/api/drivers");
        console.log("Primera API - Respuesta:", response1.data);

        const pilotosBase = response1.data.drivers;

        if (!Array.isArray(pilotosBase)) {
            throw new Error("Estructura inesperada de la primera API: No es un array");
        }

        // Consumir la segunda API (info con URLs de imágenes)
        const response2 = await axios.get("https://api.openf1.org/v1/drivers");
        console.log("Segunda API - Respuesta:", response2.data);

        const pilotosImagenes = response2.data;

        if (!Array.isArray(pilotosImagenes)) {
            throw new Error("Estructura inesperada de la segunda API: No es un array");
        }

        // Combinar datos de ambas APIs
        const pilotosCombinados = [];
        const idsProcesados = new Set(); // Evitar duplicados por driverId

        for (const pilotoBase of pilotosBase) {
            const pilotoImagen = pilotosImagenes.find(
                (pImagen) =>
                    pImagen.driver_number === pilotoBase.number || // Comparar por número de coche
                    (pImagen.first_name === pilotoBase.name && pImagen.last_name === pilotoBase.surname) // Comparar por nombre
            );

            const pilotoCombinado = {
                driverId: pilotoBase.driverId || null,
                nombre: pilotoBase.name || "Desconocido",
                apellido: pilotoBase.surname || "Sin apellido",
                nacionalidad: pilotoBase.nationality || "Sin nacionalidad",
                // Validar fecha de nacimiento: usar de la segunda API si está disponible; si no, usar la primera API
                fechaNacimiento: pilotoImagen?.birthday || pilotoBase.birthday || "Sin fecha",
                numero: pilotoBase.number || null,
                nombreCorto: pilotoBase.shortName || "Sin nombre corto",
                url: pilotoImagen ? pilotoImagen.headshot_url : null, // URL de la imagen
            };

            if (pilotoCombinado.url) {
                pilotosCombinados.push(pilotoCombinado);
                idsProcesados.add(pilotoCombinado.driverId); // Marcar como procesado

                if (pilotosCombinados.length === 20) break; // Detener si ya tenemos 20
            }
        }

        // Rellenar con pilotos de la segunda API si faltan datos
        for (const pilotoImagen of pilotosImagenes) {
            if (pilotosCombinados.length === 20) break; // Detener cuando tengamos 20

            // Evitar duplicados
            if (!idsProcesados.has(pilotoImagen.driver_number)) {
                pilotosCombinados.push({
                    driverId: pilotoImagen.driver_number || null,
                    nombre: pilotoImagen.first_name || "Desconocido",
                    apellido: pilotoImagen.last_name || "Sin apellido",
                    nacionalidad: pilotoImagen.country_code || "Sin nacionalidad",
                    fechaNacimiento: "Sin fecha", // No disponible en esta API
                    numero: pilotoImagen.driver_number || null,
                    nombreCorto: pilotoImagen.name_acronym || "Sin nombre corto",
                    url: pilotoImagen.headshot_url || "Sin URL",
                });
                idsProcesados.add(pilotoImagen.driver_number); // Marcar como procesado
            }
        }

        // Guardar en MongoDB
        for (const piloto of pilotosCombinados) {
            const nuevoPiloto = new Piloto(piloto);
            await nuevoPiloto.save();
            console.log(`Piloto guardado: ${nuevoPiloto.nombre} ${nuevoPiloto.apellido}`);
        }

        console.log("¡Se han guardado 20 pilotos con datos completos en MongoDB!");
    } catch (error) {
        console.error("Error al obtener o guardar pilotos:", error);
    }
}

fetchAndSavePilotos();
