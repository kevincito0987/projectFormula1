// // 📦 Importar módulos esenciales para manejo de APIs y base de datos
// import axios from "axios";
// import { connectDB } from "./data/mongoDb.js"; // 🔗 Conectar a MongoDB
// import Piloto from "./models/piloto.js"; // 🏎️ Modelo de pilotos
// import Team from "./models/team.js"; // 🏆 Modelo de equipos
// import Circuit from "./models/circuits.js"; // 🏁 Modelo de circuitos
// import Weather from "./models/weather.js"; // 🌦️ Modelo de datos climáticos
// import News from "./models/news.js"; // 📌 Importar el schema de noticias


// // 📸 Mapeo de imágenes actualizadas para pilotos sin imagen
// const rutasImagenesActualizadas = {
//     driver1: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/norris",
//     driver2: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/piastri",
//     driver3: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/russell",
//     driver4: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/tsunoda",
//     driver5: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/verstappen",
//     driver6: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hamilton",
//     driver7: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/leclerc",
//     driver8: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/sainz",
//     driver9: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/albon",
//     driver10: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/ocon",
//     driver11: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/alonso",
//     driver12: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/stroll",
//     driver13: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/gasly",
//     driver14: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/bortoleto",
//     driver15: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hulkenberg",
//     driver16: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/antonelli",
//     driver17: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/bearman",
//     driver18: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/fom-website/drivers/2025Drivers/lawson-racing-bulls",
//     driver19: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hadjar",
//     driver20: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/doohan"
// };

// // 🔍 Validar y obtener información de los pilotos de un equipo
// async function fetchAndValidatePilotos() {
//     try {
//         console.log("🌍 Obteniendo pilotos actuales...");
//         const response = await axios.get(`https://f1api.dev/api/current/drivers`);
//         const { drivers } = response.data;

//         console.log("📌 Datos de pilotos recibidos:", drivers);

//         if (!drivers || !Array.isArray(drivers)) {
//             console.error("❌ Error: La API no devolvió una lista válida de pilotos.");
//             return [];
//         }

//         const pilotosValidados = [];

//         for (let i = 0; i < drivers.length; i++) {
//             const driver = drivers[i]; // 🔥 Ahora accede directamente al objeto sin `driver`
//             const existingDriver = await Piloto.findOne({ driverId: driver.driverId });

//             let nuevaImagenUrl = rutasImagenesActualizadas[`driver${i + 1}`] || "https://default-image.com/default.jpg";

//             if (existingDriver) {
//                 await Piloto.updateOne({ driverId: driver.driverId }, { $set: { url: nuevaImagenUrl } });
//                 console.log(`🔄 Imagen actualizada: ${driver.name} ${driver.surname}`);
//                 pilotosValidados.push(existingDriver);
//             } else {
//                 const nuevoPiloto = new Piloto({
//                     driverId: driver.driverId,
//                     nombre: driver.name,
//                     apellido: driver.surname,
//                     nacionalidad: driver.nationality || "Desconocida",
//                     fechaNacimiento: driver.birthday || "Sin fecha",
//                     numero: driver.number || null,
//                     nombreCorto: driver.shortName || driver.name,
//                     url: nuevaImagenUrl, 
//                     team: driver.teamId, // 🔥 Se usa `teamId` en lugar de `team`
//                 });

//                 await nuevoPiloto.save();
//                 console.log(`✅ Nuevo piloto guardado con imagen correcta: ${nuevoPiloto.nombre} ${nuevoPiloto.apellido}`);
//                 pilotosValidados.push(nuevoPiloto);
//             }
//         }

//         return pilotosValidados;
//     } catch (error) {
//         console.error("❌ Error al obtener pilotos actuales:", error.message);
//         return [];
//     }
// }


// // 🏆 Obtener y almacenar equipos junto con sus pilotos
// async function fetchAndSaveTeams() {
//     try {
//         await connectDB(); // 🔗 Conectar a MongoDB

//         // 🌍 Consumir API de equipos
//         let teams;
//         try {
//             const response = await axios.get("https://f1api.dev/api/current/teams");
//             teams = response.data.teams;
//         } catch (error) {
//             console.error("❌ Error al consumir API de equipos:", error.message);
//             return;
//         }

//         if (!Array.isArray(teams)) {
//             throw new Error("❌ Estructura inesperada de la API de equipos");
//         }

//         for (const team of teams) {
//             const existingTeam = await Team.findOne({ teamId: team.teamId });

//             if (!existingTeam) {
//                 const nuevoTeam = new Team({
//                     teamId: team.teamId,
//                     nombre: team.teamName || "Desconocido",
//                     nacionalidad: team.teamNationality || "Sin nacionalidad",
//                     primeraAparicion: team.firstAppeareance || "Sin información",
//                     campeonatosConstructores: team.constructorsChampionships || 0,
//                     campeonatosPilotos: team.driversChampionships || 0,
//                     url: team.url || "Sin URL",
//                 });

//                 await nuevoTeam.save();
//                 console.log(`✅ Equipo guardado: ${nuevoTeam.nombre}`);
//             } else {
//                 console.log(`⚡ Equipo ya existente: ${team.teamName}`);
//             }

//             const pilotos = await fetchAndValidatePilotos(team.teamId);
//             console.log(`🏎️ Pilotos procesados para el equipo ${team.teamName}: ${pilotos.length}`);
//         }

//         console.log("🎉 ¡Equipos y pilotos procesados en MongoDB!");
//     } catch (error) {
//         console.error("❌ Error al obtener o guardar equipos y pilotos:", error);
//     }
// }
// // async function reasignarImagenesPilotos() {
// //     try {
// //         // 🔗 Conectar a la base de datos antes de realizar operaciones
// //         await connectDB();
// //         console.log("✅ Conectado a MongoDB.");

// //         // 🌍 Obtener pilotos desde la API local
// //         const response = await axios.get("https://projectformula1-production.up.railway.app/api/drivers");
// //         const pilotos = response.data;

// //         // 🔍 Validar que la API devuelve 20 pilotos
// //         if (!pilotos || !Array.isArray(pilotos) || pilotos.length !== 20) {
// //             console.error(`❌ Error: Se esperaban 20 pilotos, pero la API devolvió ${pilotos.length || 0}.`);
// //             return;
// //         }

// //         for (let i = 0; i < pilotos.length; i++) {
// //             const piloto = pilotos[i];

// //             // 🔗 Asignar imagen en orden según `driverX`
// //             const nuevaImagenUrl = rutasImagenesActualizadas[`driver${i + 1}`] || "https://default-image.com/default.jpg";

// //             await Piloto.updateOne(
// //                 { driverId: piloto.driverId },
// //                 { $set: { url: nuevaImagenUrl } }
// //             );

// //             console.log(`🔄 Imagen reasignada: ${piloto.nombre} ${piloto.apellido}`);
// //         }

// //         console.log("🎉 Todas las imágenes fueron actualizadas correctamente.");
// //     } catch (error) {
// //         console.error("❌ Error al conectar o actualizar imágenes de los pilotos:", error.message);
// //     }
// // }

// // reasignarImagenesPilotos();

// fetchAndSaveTeams();