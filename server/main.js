// 📦 Importar módulos esenciales para manejo de APIs y base de datos
const axios = require("axios");
const { connectDB } = require("./data/mongoDb.js"); // 🔗 Conectar a MongoDB
const Piloto = require("./models/piloto"); // 🏎️ Modelo de pilotos
const Team = require("./models/team"); // 🏆 Modelo de equipos
const Circuit = require("./models/circuits"); // 🏁 Modelo de circuitos
const Weather = require("./models/weather"); // 🌦️ Modelo de datos climáticos
const News = require("./models/news"); // 📌 Importar el schema de noticias


// 📸 Mapeo de imágenes actualizadas para pilotos
const rutasImagenesActualizadas = {
    norris: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/antonelli",
    sainz: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/tsunoda",
    verstappen: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/verstappen",
    leclerc: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/bearman",
    perez: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/fom-website/drivers/2025Drivers/lawson-racing-bulls",
    hamilton: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hadjar",
    russell: "https://gpticketstore.vshcdn.net/uploads/images/10726/jack-doohan-alpine-big.jpg",
};

// 🔍 Validar y obtener información de los pilotos de un equipo
async function fetchAndValidatePilotos(teamId) {
    try {
        // 🌍 Consumir API de pilotos
        const response = await axios.get(`https://f1api.dev/api/current/teams/${teamId}/drivers`);
        const { drivers } = response.data;

        if (!drivers || !Array.isArray(drivers)) {
            console.error(`❌ Estructura inesperada de la respuesta para el equipo ${teamId}`);
            return [];
        }

        // 📸 Consumir API de imágenes de pilotos
        let pilotosImagenes;
        try {
            const response2 = await axios.get("https://api.openf1.org/v1/drivers");
            pilotosImagenes = response2.data;
        } catch (error) {
            console.error("❌ Error al consumir API de imágenes:", error.message);
            pilotosImagenes = [];
        }

        const pilotosValidados = [];

        for (const driverData of drivers) {
            const driver = driverData.driver;
            const existingDriver = await Piloto.findOne({ driverId: driver.driverId });

            // 📸 Buscar datos de la segunda API
            const pilotoImagen = pilotosImagenes.find(
                (pImagen) => pImagen.driver_number === driver.number || 
                             (pImagen.first_name === driver.name && pImagen.last_name === driver.surname)
            );

            // 🔗 Validar y asignar imagen
            let imagenUrl = pilotoImagen?.headshot_url || rutasImagenesActualizadas[driver.driverId] || null;
            if (!imagenUrl || imagenUrl === "Sin URL") {
                console.error(`❌ Piloto ${driver.name} ${driver.surname} sin imagen asignada.`);
                continue;
            }

            if (existingDriver) {
                const fieldsToUpdate = {};
                if (!existingDriver.fechaNacimiento) fieldsToUpdate.fechaNacimiento = pilotoImagen?.birthday || "Sin fecha";
                if (!existingDriver.url || !existingDriver.url.startsWith("http")) {
                    fieldsToUpdate.url = imagenUrl;
                }

                if (Object.keys(fieldsToUpdate).length > 0) {
                    await Piloto.updateOne({ driverId: driver.driverId }, { $set: fieldsToUpdate });
                    console.log(`🔄 Piloto actualizado: ${driver.name} ${driver.surname}`);
                }

                pilotosValidados.push(existingDriver);
            } else {
                const nuevoPiloto = new Piloto({
                    driverId: driver.driverId,
                    nombre: driver.name,
                    apellido: driver.surname,
                    nacionalidad: driver.nationality,
                    fechaNacimiento: pilotoImagen?.birthday || driver.birthday || "Sin fecha",
                    numero: driver.number || null,
                    nombreCorto: driver.shortName || "Sin nombre corto",
                    url: imagenUrl,
                    team: teamId,
                });

                await nuevoPiloto.save();
                console.log(`✅ Nuevo piloto agregado: ${nuevoPiloto.nombre} ${nuevoPiloto.apellido}`);
                pilotosValidados.push(nuevoPiloto);
            }
        }

        return pilotosValidados;
    } catch (error) {
        console.error(`❌ Error al obtener pilotos del equipo ${teamId}:`, error.message);
        return [];
    }
}

// 🏆 Obtener y almacenar equipos junto con sus pilotos
async function fetchAndSaveTeams() {
    try {
        await connectDB(); // 🔗 Conectar a MongoDB

        // 🌍 Consumir API de equipos
        let teams;
        try {
            const response = await axios.get("https://f1api.dev/api/current/teams");
            teams = response.data.teams;
        } catch (error) {
            console.error("❌ Error al consumir API de equipos:", error.message);
            return;
        }

        if (!Array.isArray(teams)) {
            throw new Error("❌ Estructura inesperada de la API de equipos");
        }

        for (const team of teams) {
            const existingTeam = await Team.findOne({ teamId: team.teamId });

            if (!existingTeam) {
                const nuevoTeam = new Team({
                    teamId: team.teamId,
                    nombre: team.teamName || "Desconocido",
                    nacionalidad: team.teamNationality || "Sin nacionalidad",
                    primeraAparicion: team.firstAppeareance || "Sin información",
                    campeonatosConstructores: team.constructorsChampionships || 0,
                    campeonatosPilotos: team.driversChampionships || 0,
                    url: team.url || "Sin URL",
                });

                await nuevoTeam.save();
                console.log(`✅ Equipo guardado: ${nuevoTeam.nombre}`);
            } else {
                console.log(`⚡ Equipo ya existente: ${team.teamName}`);
            }

            const pilotos = await fetchAndValidatePilotos(team.teamId);
            console.log(`🏎️ Pilotos procesados para el equipo ${team.teamName}: ${pilotos.length}`);
        }

        console.log("🎉 ¡Equipos y pilotos procesados en MongoDB!");
    } catch (error) {
        console.error("❌ Error al obtener o guardar equipos y pilotos:", error);
    }
}

// 📦 Mapeo de imágenes para los circuitos de F1
const circuitImages = {
    Circuit1: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit", // 🇧🇭 Circuito de Baréin
    Circuit2: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit", // 🇸🇦 Circuito de Arabia Saudita
    Circuit3: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit", // 🇦🇺 Circuito de Australia
    Circuit4: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit", // 🇯🇵 Circuito de Japón
    Circuit5: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit", // 🇨🇳 Circuito de China
    Circuit6: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit", // 🇺🇸 Circuito de Miami
    Circuit7: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit", // 🇮🇹 Circuito de Imola
    Circuit8: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit", // 🇲🇨 Circuito de Mónaco
    Circuit9: "https://static.wikia.nocookie.net/f1wikia/images/5/5c/CircuitGillesVilleneuve.png/revision/latest/scale-to-width-down/1200?cb=20220401000204", // 🇨🇦 Circuito Gilles Villeneuve
    Circuit10: "https://static.wikia.nocookie.net/f1wikia/images/b/bf/Circuit_de_Barcelona-Catalunya.png/revision/latest?cb=20220331225556", // 🇪🇸 Circuito de Barcelona-Cataluña
    Circuit11: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit", // 🇦🇹 Circuito de Austria
    Circuit12: "https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit", // 🇬🇧 Circuito de Silverstone
};

// 🔍 Obtener y almacenar circuitos en la base de datos
async function fetchAndSaveCircuits() {
    try {
        await connectDB(); // 🔗 Conectar a MongoDB

        // 🌍 Consumir API de circuitos
        const response = await axios.get("https://f1api.dev/api/circuits");
        const circuitos = response.data.circuits;

        if (!Array.isArray(circuitos) || circuitos.length === 0) {
            throw new Error("❌ No se encontraron circuitos en la API.");
        }

        // 🔢 Obtener los primeros 12 circuitos
        const primeros12Circuitos = circuitos.slice(0, 12);

        for (const [index, circuito] of primeros12Circuitos.entries()) {
            const existingCircuit = await Circuit.findOne({ circuitId: circuito.circuitId });

            if (!existingCircuit) {
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
                    urlImagen: circuitImages[`Circuit${index + 1}`] || "❌ Sin URL de imagen",
                });

                await nuevoCircuito.save();
                console.log(`✅ Circuito guardado: ${nuevoCircuito.nombre}`);
            } else {
                console.log(`⚡ Circuito ya existente: ${existingCircuit.nombre}`);
            }
        }

        console.log("🏁 ¡Se han procesado los circuitos en MongoDB!");
    } catch (error) {
        console.error("❌ Error al obtener o guardar los circuitos:", error.message);
    }
}
// ⏳ Función para esperar antes de una nueva solicitud
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); // ⏱️ Pausa la ejecución por `ms` milisegundos
}

// 🔄 Función para reintentar la solicitud si la API limita las peticiones (código 429)
async function fetchWithRetry(url, retries = 3, delayMs = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url); // 🌍 Intentar obtener datos desde la API
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log(`⚠️ Intento ${i + 1}: La API está limitando solicitudes. Reintentando en ${delayMs / 1000} segundos...`);
                await delay(delayMs); // ⏳ Esperar antes de intentar nuevamente
            } else {
                throw error; // ❌ Lanzar error si no es un problema de límite de peticiones
            }
        }
    }
    throw new Error("❌ No se pudo obtener datos después de varios intentos.");
}

// 🌦️ Obtener y almacenar datos meteorológicos en la base de datos
async function fetchAndSaveWeather() {
    try {
        await connectDB(); // 🔗 Conectar a MongoDB

        // 🌍 Consumir API del clima con reintentos en caso de limitación de solicitudes
        const response = await fetchWithRetry("https://api.openf1.org/v1/weather");
        const weatherData = response.data;

        if (!Array.isArray(weatherData) || weatherData.length === 0) {
            throw new Error("❌ No se encontraron datos de clima en la API.");
        }

        // 🔥 Clasificar los datos en categorías de clima
        const categoriasClima = {
            soleado: [],
            lluvioso: [],
            nublado: [],
            ventoso: [],
            extremo: []
        };

        for (const weather of weatherData) {
            let categoria = "extremo"; // 🌪️ Valor por defecto si no entra en otra categoría

            if (weather.rainfall === 0 && weather.air_temperature > 25 && weather.track_temperature > 40) {
                categoria = "soleado"; // ☀️ Condiciones cálidas y secas
                categoriasClima.soleado.push(weather);
            } else if (weather.rainfall > 0) {
                categoria = "lluvioso"; // ☔ Lluvia detectada
                categoriasClima.lluvioso.push(weather);
            } else if (weather.humidity > 80 && weather.air_temperature < 20) {
                categoria = "nublado"; // ☁️ Alta humedad con baja temperatura
                categoriasClima.nublado.push(weather);
            } else if (weather.wind_speed > 10) {
                categoria = "ventoso"; // 💨 Fuertes vientos en la pista
                categoriasClima.ventoso.push(weather);
            } else {
                categoriasClima.extremo.push(weather); // 🌪️ Condiciones severas o poco comunes
            }

            weather.categoria = categoria; // 📌 Asignar la categoría al objeto de clima
        }

        // 🎯 Seleccionar los primeros 2 registros de cada categoría
        const climaSeleccionado = [
            ...categoriasClima.soleado.slice(0, 2),
            ...categoriasClima.lluvioso.slice(0, 2),
            ...categoriasClima.nublado.slice(0, 2),
            ...categoriasClima.ventoso.slice(0, 2),
            ...categoriasClima.extremo.slice(0, 2)
        ];

        // 📝 Guardar los datos clasificados en MongoDB
        for (const weather of climaSeleccionado) {
            const nuevoClima = new Weather({
                airTemperature: weather.air_temperature, // 🌡️ Temperatura del aire
                date: weather.date, // 📅 Fecha del registro
                humidity: weather.humidity, // 💧 Humedad relativa
                meetingKey: weather.meeting_key, // 🏁 Identificador de reunión
                pressure: weather.pressure, // 🌬️ Presión atmosférica
                rainfall: weather.rainfall === 1, // ☔ Indica si hubo lluvia
                sessionKey: weather.session_key, // 🔑 Identificador de sesión
                trackTemperature: weather.track_temperature, // 🏎️ Temperatura de la pista
                windDirection: weather.wind_direction, // 🌪️ Dirección del viento
                windSpeed: weather.wind_speed, // 💨 Velocidad del viento
                categoria: weather.categoria // 🏷️ Categoría asignada
            });

            const existingWeather = await Weather.findOne({ date: weather.date, meetingKey: weather.meeting_key });

            if (existingWeather) {
                console.log(`⚡ Datos de clima ya existentes para: Fecha ${nuevoClima.date}, reunión ${nuevoClima.meetingKey}, categoría ${nuevoClima.categoria}`);
            } else {
                await delay(1000); // ⏳ Esperar 1 segundo antes de guardar cada registro
                await nuevoClima.save();
                console.log(`✅ Datos de clima guardados para: Fecha ${nuevoClima.date}, reunión ${nuevoClima.meetingKey}, categoría ${nuevoClima.categoria}`);
            }
        }

        console.log("🎉 ¡Los datos de clima han sido guardados y organizados por categoría en MongoDB!");
    } catch (error) {
        console.error("❌ Error al obtener o guardar los datos de clima:", error.message);
    }
}

// 🌍 Función para obtener TODAS las noticias de la API
async function fetchAndSaveNews() {
    try {
        await connectDB(); // 🔗 Conectar a MongoDB

        console.log("🌍 Consultando noticias de la API...");
        const response = await fetch("https://newsdata.io/api/1/news?apikey=pub_84242dd4d0babd6f98871ec1289f74df4957b&q=formula%201");
        const newsData = await response.json();

        if (!Array.isArray(newsData.results) || newsData.results.length === 0) {
            throw new Error("❌ No se encontraron noticias.");
        }

        console.log(`📢 Se encontraron ${newsData.results.length} noticias. Procesando...`);

        for (const article of newsData.results) {
            const existingNews = await News.findOne({ article_id: article.article_id });

            if (!existingNews) {
                const creatorValue = Array.isArray(article.creator) && article.creator.length > 0 
                    ? article.creator.join(", ")  // 🔹 Convierte el array en un string separado por comas
                    : "Desconocido";  // 🚀 Si está vacío o es null, asigna "Desconocido"

                const nuevaNoticia = new News({
                    article_id: article.article_id,
                    title: article.title || "Título no disponible",
                    link: article.link,
                    keywords: article.keywords || [],
                    creator: creatorValue, // ✅ Ahora `creator` es un string, no un array
                    description: article.description || "Sin descripción disponible",
                    pubDate: new Date(article.pubDate),
                    image_url: article.image_url || "../assets/images/defaultNewsImage.jpeg",
                    source_name: article.source_name,
                    source_icon: article.source_icon || "../assets/icons/icon2Formula1.svg",
                    category: article.category || [],
                    language: article.language || "english"
                });

                await nuevaNoticia.save();
                console.log(`✅ Noticia guardada: ${nuevaNoticia.title}`);
            } else {
                console.log(`⚡ Noticia ya existente: ${existingNews.title}`);
            }
        }

        console.log("🎉 ¡Todas las noticias han sido guardadas en MongoDB!");
    } catch (error) {
        console.error("❌ Error al obtener o guardar las noticias:", error.message);
    }
}

// 🔥 Ejecutar la función para obtener y guardar noticias
// fetchAndSaveNews();

async function fetchAndSaveNews() {
    try {
        await connectDB(); // 🔗 Conectar a MongoDB

        console.log("🌍 Consultando noticias de la API...");
        const response = await fetch("https://newsdata.io/api/1/news?apikey=pub_84242dd4d0babd6f98871ec1289f74df4957b&q=formula%201");
        const newsData = await response.json();

        if (!Array.isArray(newsData.results) || newsData.results.length === 0) {
            throw new Error("❌ No se encontraron noticias.");
        }

        console.log(`📢 Se encontraron ${newsData.results.length} noticias. Aplicando filtros...`);

        // 🔥 Lista de términos clave estrictos sobre F1
        const keywordsF1 = [
            "Formula 1", "F1", "Grand Prix", "Hamilton", "Verstappen", "Red Bull", 
            "Ferrari", "Mercedes", "McLaren", "Alpine", "Aston Martin", "Pirelli"
        ];

        // 🏎️ Filtrar noticias estrictamente relacionadas con F1
        const filteredNews = newsData.results.filter(article => 
            keywordsF1.some(keyword => 
                (article.title && article.title.includes(keyword)) ||
                (article.description && article.description.includes(keyword))
            )
        );

        console.log(`✅ ${filteredNews.length} noticias relevantes después del filtro.`);

        for (const article of filteredNews) {
            const existingNews = await News.findOne({ article_id: article.article_id });

            if (!existingNews) {
                const creatorValue = Array.isArray(article.creator) && article.creator.length > 0 
                    ? article.creator.join(", ")  
                    : "Desconocido";  

                const nuevaNoticia = new News({
                    article_id: article.article_id,
                    title: article.title || "Título no disponible",
                    link: article.link,
                    keywords: article.keywords || [],
                    creator: creatorValue,
                    description: article.description || "Sin descripción disponible",
                    pubDate: new Date(article.pubDate),
                    image_url: article.image_url || "../assets/images/defaultNewsImage.jpeg",
                    source_name: article.source_name,
                    source_icon: article.source_icon || "../assets/icons/icon2Formula1.svg",
                    category: article.category || [],
                    language: article.language || "english"
                });

                await nuevaNoticia.save();
                console.log(`✅ Noticia guardada: ${nuevaNoticia.title}`);
            } else {
                console.log(`⚡ Noticia ya existente: ${existingNews.title}`);
            }
        }

        console.log("🎉 ¡Noticias de F1 guardadas correctamente en MongoDB!");
    } catch (error) {
        console.error("❌ Error al obtener o guardar las noticias:", error.message);
    }
}

// 🔥 Ejecutar la función y guardar solo noticias estrictamente relacionadas con F1
// fetchAndSaveNews();

// 🌍 Función para obtener noticias y filtrarlas por F1
// 🌍 Función para obtener noticias y filtrarlas por F1