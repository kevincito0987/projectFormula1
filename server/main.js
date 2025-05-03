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
async function reasignarImagenesPilotos() {
    try {
        // 🔗 Conectar a la base de datos antes de realizar operaciones
        await connectDB();
        console.log("✅ Conectado a MongoDB.");

        // 🌍 Obtener pilotos desde la API local
        const response = await axios.get("https://projectformula1-production.up.railway.app/api/drivers");
        const pilotos = response.data;

        // 🔍 Validar que la API devuelve 20 pilotos
        if (!pilotos || !Array.isArray(pilotos) || pilotos.length !== 20) {
            console.error(`❌ Error: Se esperaban 20 pilotos, pero la API devolvió ${pilotos.length || 0}.`);
            return;
        }

        for (let i = 0; i < pilotos.length; i++) {
            const piloto = pilotos[i];

            // 🔗 Asignar imagen en orden según `driverX`
            const nuevaImagenUrl = rutasImagenesActualizadas[`driver${i + 1}`] || "https://default-image.com/default.jpg";

            await Piloto.updateOne(
                { driverId: piloto.driverId },
                { $set: { url: nuevaImagenUrl } }
            );

            console.log(`🔄 Imagen reasignada: ${piloto.nombre} ${piloto.apellido}`);
        }

        console.log("🎉 Todas las imágenes fueron actualizadas correctamente.");
    } catch (error) {
        console.error("❌ Error al conectar o actualizar imágenes de los pilotos:", error.message);
    }
}

reasignarImagenesPilotos();
