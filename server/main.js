 // 📦 Importar módulos esenciales para manejo de APIs y base de datos
import axios from "axios";
import { connectDB } from "./data/mongoDb.js"; // 🔗 Conectar a MongoDB
 import Piloto from "./models/piloto.js"; // 🏎️ Modelo de pilotos


 // 📸 Mapeo de imágenes actualizadas para pilotos sin imagen
 const rutasImagenesActualizadas = {
     driver1: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/norris",
     driver2: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/piastri",
     driver3: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/russell",
     driver4: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/tsunoda",
     driver5: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/verstappen",
     driver6: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hamilton",
     driver7: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/leclerc",
     driver8: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/sainz",
     driver9: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/albon",
     driver10: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/ocon",
     driver11: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/alonso",
     driver12: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/stroll",
     driver13: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/gasly",
     driver14: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/bortoleto",
     driver15: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hulkenberg",
     driver16: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/antonelli",
     driver17: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/bearman",
     driver18: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/fom-website/drivers/2025Drivers/lawson-racing-bulls",
     driver19: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/hadjar",
     driver20: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/2025Drivers/doohan"
 };

// 🏎️ **Primero obtenemos todos los pilotos de la API**
async function obtenerPilotos() {
    try {
        await connectDB();
        console.log("✅ Conectado a MongoDB.");

        const response = await axios.get("https://projectformula1-production.up.railway.app/api/drivers");
        const pilotos = response.data;

        if (!pilotos || !Array.isArray(pilotos)) {
            console.error(`❌ Error: La API no devolvió pilotos válidos.`);
            return [];
        }

        console.log("📌 Pilotos obtenidos correctamente.");
        return pilotos;
    } catch (error) {
        console.error("❌ Error al obtener pilotos:", error.message);
        return [];
    }
}

// 🏎️ **Luego reasignamos las imágenes respetando el orden de la API**
async function reasignarImagenesPilotos(pilotos) {
    try {
        if (!pilotos || pilotos.length === 0) {
            console.error("❌ No hay pilotos disponibles para reasignar imágenes.");
            return;
        }

        let cambiosRealizados = false;

        for (let i = 0; i < pilotos.length; i++) {
            const piloto = pilotos[i];
            const nuevaImagenUrl = rutasImagenesActualizadas[`driver${i + 1}`] || "https://default-image.com/default.jpg";

            const pilotoActual = await Piloto.findOne({ driverId: piloto.driverId });

            if (pilotoActual && pilotoActual.url === nuevaImagenUrl) {
                console.log(`✅ Imagen ya asignada para ${piloto.nombre} ${piloto.apellido}, no se actualiza.`);
                continue;
            }

            const updateResult = await Piloto.updateOne(
                { driverId: piloto.driverId },
                { $set: { url: nuevaImagenUrl } }
            );

            if (updateResult.modifiedCount > 0) {
                console.log(`🔄 Imagen reasignada: ${piloto.nombre} ${piloto.apellido}`);
                cambiosRealizados = true;
            }
        }

        if (cambiosRealizados) {
            console.log("🎉 Todas las imágenes fueron actualizadas correctamente.");
        } else {
            console.log("✅ No se realizaron cambios, todas las imágenes ya estaban asignadas.");
        }
    } catch (error) {
        console.error("❌ Error al reasignar imágenes de los pilotos:", error.message);
    }
}

// 🔥 **Ejecutar el proceso en dos pasos**
async function ejecutarProceso() {
    const pilotos = await obtenerPilotos();
    await reasignarImagenesPilotos(pilotos);
}

ejecutarProceso();