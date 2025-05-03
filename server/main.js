import axios from "axios";
import { connectDB } from "./data/mongoDb.js"; // Conectar a MongoDB
import Circuito from "./models/circuits.js"; // Modelo de circuitos

// URLs actualizadas para los circuitos
const circuitsImages = {
    "6812af886cc71c50b65bff6b": "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png",
    "6812af886cc71c50b65bff6e": "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png"
};

// 🏎️ **Obtener todos los circuitos de la API**
async function obtenerCircuitos() {
    try {
        await connectDB();
        console.log("✅ Conectado a MongoDB.");

        const response = await axios.get("https://projectformula1-production.up.railway.app/api/circuits");
        const circuitos = response.data;

        if (!circuitos || !Array.isArray(circuitos)) {
            console.error(`❌ Error: La API no devolvió circuitos válidos.`);
            return [];
        }

        console.log("📌 Circuitos obtenidos correctamente.");
        return circuitos;
    } catch (error) {
        console.error("❌ Error al obtener circuitos:", error.message);
        return [];
    }
}

// 🏎️ **Actualizar imágenes de los circuitos específicos**
async function actualizarImagenesCircuitos(circuitos) {
    try {
        if (!circuitos || circuitos.length === 0) {
            console.error("❌ No hay circuitos disponibles para actualizar imágenes.");
            return;
        }

        const actualizaciones = circuitos
            .filter(circuito => circuitsImages[circuito._id]) // Filtra los circuitos que tienen una nueva imagen asignada
            .map(async circuito => {
                const nuevaImagenUrl = circuitsImages[circuito._id];
                const circuitoActual = await Circuito.findOne({ _id: circuito._id });

                if (circuitoActual && circuitoActual.urlImagen === nuevaImagenUrl) {
                    console.log(`✅ Imagen ya asignada para ${circuito.nombre}, no se actualiza.`);
                    return null;
                }

                return Circuito.updateOne(
                    { _id: circuito._id },
                    { $set: { urlImagen: nuevaImagenUrl } }
                );
            });

        await Promise.all(actualizaciones);
        console.log("🎉 Imágenes de los circuitos actualizadas correctamente.");
    } catch (error) {
        console.error("❌ Error al actualizar imágenes de los circuitos:", error.message);
    }
}

// 🔥 **Ejecutar el proceso en dos pasos**
async function ejecutarProceso() {
    const circuitos = await obtenerCircuitos();
    await actualizarImagenesCircuitos(circuitos);
}

ejecutarProceso();
