const axios = require("axios");
const { connectDB } = require("./data/mongoDb.js");
const Piloto = require("./models/piloto");
const Team = require("./models/team"); // Esquema para la colección de equipos

async function fetchAndSavePilotos() {
    try {
        await connectDB(); // Conectar a MongoDB

        // Consumir la primera API (info básica de pilotos)
        const response1 = await axios.get("https://f1api.dev/api/current/drivers");
        console.log("Primera API - Respuesta:", response1.data);

        const pilotosBase = response1.data.drivers;

        if (!Array.isArray(pilotosBase)) {
            throw new Error("Estructura inesperada de la primera API: No es un array");
        }

        // Consumir la segunda API (solo imágenes y fechas)
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
            console.log(`Piloto: ${pilotoBase.name} - TeamID: ${pilotoBase.teamId}`); // Verificar TeamID

            const pilotoImagen = pilotosImagenes.find(
                (pImagen) =>
                    pImagen.driver_number === pilotoBase.number || 
                    (pImagen.first_name === pilotoBase.name && pImagen.last_name === pilotoBase.surname)
            );

            // Combinar solo URL de imagen y fecha de nacimiento
            const pilotoCombinado = {
                driverId: pilotoBase.driverId || null,
                nombre: pilotoBase.name || "Desconocido",
                apellido: pilotoBase.surname || "Sin apellido",
                nacionalidad: pilotoBase.nationality || "Sin nacionalidad",
                fechaNacimiento: pilotoImagen?.birthday || pilotoBase.birthday || "Sin fecha", // Priorizar la fecha de la segunda API
                numero: pilotoBase.number || null,
                nombreCorto: pilotoBase.shortName || "Sin nombre corto",
                url: pilotoImagen?.headshot_url || "Sin URL", // Usar URL de imagen de la segunda API si está disponible
                team: pilotoBase.teamId || "Equipo desconocido", // Usar directamente el teamId de la primera API
            };

            if (!idsProcesados.has(pilotoCombinado.driverId)) {
                pilotosCombinados.push(pilotoCombinado);
                idsProcesados.add(pilotoCombinado.driverId); // Marcar como procesado
            }
        }

        // Guardar en MongoDB
        for (const piloto of pilotosCombinados) {
            const nuevoPiloto = new Piloto(piloto);
            await nuevoPiloto.save();
            console.log(`Piloto guardado: ${nuevoPiloto.nombre} (${nuevoPiloto.team})`);
        }

        console.log("¡Se han guardado los pilotos con datos actualizados en MongoDB!");
    } catch (error) {
        console.error("Error al obtener o guardar pilotos:", error);
    }
}

// fetchAndSavePilotos();
async function fetchAndSaveTeams() {
    try {
        await connectDB(); // Conectar a MongoDB

        // Consumir la API de equipos actuales
        let teams;
        try {
            const response = await axios.get("https://f1api.dev/api/current/teams");
            teams = response.data.teams;
        } catch (error) {
            console.error("Error al consumir la API de equipos:", error.message);
            return; // Salir si la API falla
        }

        if (!Array.isArray(teams)) {
            throw new Error("Estructura inesperada de la API: No es un array");
        }

        // Guardar los equipos en MongoDB
        for (const team of teams) {
            const nuevoTeam = new Team({
                teamId: team.teamId || null,
                nombre: team.teamName || "Desconocido",
                nacionalidad: team.teamNationality || "Sin nacionalidad",
                primeraAparicion: team.firstAppeareance || "Sin información",
                campeonatosConstructores: team.constructorsChampionships || 0,
                campeonatosPilotos: team.driversChampionships || 0,
                url: team.url || "Sin URL",
            });

            await nuevoTeam.save();
            console.log(`Equipo guardado: ${nuevoTeam.nombre}`);
        }

        console.log("¡Se han guardado los equipos actuales de F1 en MongoDB!");
    } catch (error) {
        console.error("Error al obtener o guardar los equipos:", error);
    }
}

fetchAndSaveTeams();