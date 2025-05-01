const axios = require("axios");
const { connectDB } = require("./data/mongoDb.js");
const Piloto = require("./models/piloto");
const Team = require("./models/team");
const Circuit = require("./models/circuits");

const rutasImagenesActualizadas = {
    norris: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/antonelli",
    sainz: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/tsunoda",
    verstappen: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/verstappen",
    leclerc: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/bearman",
    perez: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/fom-website/drivers/2025Drivers/lawson-racing-bulls",
    hamilton: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hadjar",
    russell: "https://gpticketstore.vshcdn.net/uploads/images/10726/jack-doohan-alpine-big.jpg",
};

async function fetchAndValidatePilotos(teamId) {
    try {
        // Consumir la API de pilotos para un equipo específico
        const response = await axios.get(`https://f1api.dev/api/current/teams/${teamId}/drivers`);
        const { drivers } = response.data;

        if (!drivers || !Array.isArray(drivers)) {
            console.error(`Estructura inesperada de la respuesta de pilotos para el equipo ${teamId}`);
            return [];
        }

        // Consumir la segunda API para obtener imágenes y fechas
        let pilotosImagenes;
        try {
            const response2 = await axios.get("https://api.openf1.org/v1/drivers");
            pilotosImagenes = response2.data;
        } catch (error) {
            console.error("Error al consumir la segunda API para imágenes:", error.message);
            pilotosImagenes = [];
        }

        const pilotosValidados = [];

        for (const driverData of drivers) {
            const driver = driverData.driver;
            const existingDriver = await Piloto.findOne({ driverId: driver.driverId });

            // Buscar datos de la segunda API
            const pilotoImagen = pilotosImagenes.find(
                (pImagen) => pImagen.driver_number === driver.number || 
                             (pImagen.first_name === driver.name && pImagen.last_name === driver.surname)
            );

            // Validar si el piloto tiene una imagen en alguna de las dos APIs
            let imagenUrl = pilotoImagen?.headshot_url || rutasImagenesActualizadas[driver.driverId] || null;
            if (!imagenUrl || imagenUrl === "Sin URL") {
                // Si no tiene imagen y tampoco en el mapeo, lanzar un error
                console.error(`El piloto ${driver.name} ${driver.surname} no tiene imagen asignada ni en el mapeo.`);
                continue; // Omitir este piloto si no tiene ninguna imagen
            }

            if (existingDriver) {
                // Validar si la información está completa o si necesita actualizar la URL
                const fieldsToUpdate = {};
                if (!existingDriver.fechaNacimiento) fieldsToUpdate.fechaNacimiento = pilotoImagen?.birthday || "Sin fecha";
                if (!existingDriver.url || !existingDriver.url.startsWith("http")) {
                    fieldsToUpdate.url = imagenUrl; // Usar la URL encontrada o asignada
                }

                if (Object.keys(fieldsToUpdate).length > 0) {
                    await Piloto.updateOne({ driverId: driver.driverId }, { $set: fieldsToUpdate });
                    console.log(`Piloto actualizado: ${driver.name} ${driver.surname}`);
                }

                pilotosValidados.push(existingDriver);
            } else {
                // Crear nuevo piloto si no existe en la base de datos
                const nuevoPiloto = new Piloto({
                    driverId: driver.driverId,
                    nombre: driver.name,
                    apellido: driver.surname,
                    nacionalidad: driver.nationality,
                    fechaNacimiento: pilotoImagen?.birthday || driver.birthday || "Sin fecha",
                    numero: driver.number || null,
                    nombreCorto: driver.shortName || "Sin nombre corto",
                    url: imagenUrl, // Usar la URL encontrada o asignada
                    team: teamId,
                });

                await nuevoPiloto.save();
                console.log(`Nuevo piloto agregado: ${nuevoPiloto.nombre} ${nuevoPiloto.apellido}`);
                pilotosValidados.push(nuevoPiloto);
            }
        }

        return pilotosValidados;
    } catch (error) {
        console.error(`Error al obtener o validar los pilotos del equipo ${teamId}:`, error.message);
        return [];
    }
}

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
            throw new Error("Estructura inesperada de la API de equipos: No es un array");
        }

        for (const team of teams) {
            const nuevoTeam = new Team({
                teamId: team.teamId,
                nombre: team.teamName || "Desconocido",
                nacionalidad: team.teamNationality || "Sin nacionalidad",
                primeraAparicion: team.firstAppeareance || "Sin información",
                campeonatosConstructores: team.constructorsChampionships || 0,
                campeonatosPilotos: team.driversChampionships || 0,
                url: team.url || "Sin URL",
            });

            const existingTeam = await Team.findOne({ teamId: team.teamId });

            if (existingTeam) {
                console.log(`Equipo ya existente: ${team.teamName}`);
            } else {
                await nuevoTeam.save();
                console.log(`Equipo guardado: ${nuevoTeam.nombre}`);
            }

            // Validar y agregar pilotos de cada equipo
            const pilotos = await fetchAndValidatePilotos(team.teamId);
            console.log(`Pilotos procesados para el equipo ${team.teamName}: ${pilotos.length}`);
        }

        console.log("¡Se han procesado los equipos y pilotos en MongoDB!");
    } catch (error) {
        console.error("Error al obtener o guardar equipos y pilotos:", error);
    }
}

// Punto de entrada
// fetchAndSaveTeams();

const circuitImages = {
    Circuit1: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit",
    Circuit2: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit",
    Circuit3: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit",
    Circuit4: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit",
    Circuit5: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit",
    Circuit6: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit",
    Circuit7: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit",
    Circuit8: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit",
    Circuit9: "https://static.wikia.nocookie.net/f1wikia/images/5/5c/CircuitGillesVilleneuve.png/revision/latest/scale-to-width-down/1200?cb=20220401000204",
    Circuit10: "https://static.wikia.nocookie.net/f1wikia/images/b/bf/Circuit_de_Barcelona-Catalunya.png/revision/latest?cb=20220331225556",
    Circuit11: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit",
    Circuit12: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit",
};

async function fetchAndSaveCircuits() {
    try {
        await connectDB(); // Conectar a MongoDB

        // Consumir la API de circuitos
        const response = await axios.get("https://f1api.dev/api/circuits");
        const circuitos = response.data.circuits;

        if (!Array.isArray(circuitos) || circuitos.length === 0) {
            throw new Error("No se encontraron circuitos en la API.");
        }

        // Obtener los primeros 12 circuitos
        const primeros12Circuitos = circuitos.slice(0, 12);

        for (const [index, circuito] of primeros12Circuitos.entries()) {
            const nuevoCircuito = new Circuit({
                circuitId: circuito.circuitId,
                nombre: circuito.circuitName,
                pais: circuito.country,
                ciudad: circuito.city,
                longitud: circuito.circuitLength,
                lapRecord: circuito.lapRecord,
                primerAñoParticipacion: circuito.firstParticipationYear,
                numeroCurvas: circuito.numberOfCorners,
                pilotoVueltaRapida: circuito.fastestLapDriverId,
                equipoVueltaRapida: circuito.fastestLapTeamId,
                añoVueltaRapida: circuito.fastestLapYear,
                url: circuito.url,
                urlImagen: circuitImages[`Circuit${index + 1}`] || "Sin URL de imagen", // Asignar URL de imagen
            });

            const existingCircuit = await Circuit.findOne({ circuitId: circuito.circuitId });
            if (existingCircuit) {
                console.log(`El circuito ya existe: ${nuevoCircuito.nombre}`);
            } else {
                await nuevoCircuito.save();
                console.log(`Circuito guardado: ${nuevoCircuito.nombre}`);
            }
        }

        console.log("¡Se han guardado los primeros 12 circuitos en la colección 'circuits'!");
    } catch (error) {
        console.error("Error al obtener o guardar los circuitos:", error.message);
    }
}

// Ejecutar la función
// fetchAndSaveCircuits();
