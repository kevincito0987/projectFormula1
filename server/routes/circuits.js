// 📦 Importar módulos esenciales para manejar rutas y modelos
import express from "express";
import Circuit from "../models/circuits.js";

const router = express.Router();

// 🏎️ Obtener todos los circuitos de la base de datos
router.get("/", async (req, res) => {
    try {
        const circuits = await Circuit.find(); // 🔍 Consulta de todos los circuitos
        res.json(circuits); // 📦 Respuesta con la lista de circuitos
    } catch (error) {
        console.error("❌ Error al obtener los circuitos:", error);
        res.status(500).json({ error: "Error al obtener los circuitos: " + error.message });
    }
});

// 🔍 Obtener un circuito por `circuitId`
router.get("/:circuitId", async (req, res) => {
    try {
        const { circuitId } = req.params; // 🏁 Extraer el ID del circuito desde los parámetros
        const circuit = await Circuit.findOne({ circuitId }); // 🔎 Buscar el circuito por su ID

        if (!circuit) {
            return res.status(404).json({ error: "Circuito no encontrado" });
        }

        res.json(circuit); // 📦 Enviar los detalles del circuito encontrado
    } catch (error) {
        console.error("❌ Error al obtener el circuito:", error);
        res.status(500).json({ error: "Error al obtener el circuito: " + error.message });
    }
});

// 🌍 Obtener circuitos por país
router.get("/pais/:pais", async (req, res) => {
    try {
        const { pais } = req.params; // 🏙️ Extraer el país desde los parámetros
        const circuits = await Circuit.find({ pais });

        if (circuits.length === 0) {
            return res.status(404).json({ error: "No se encontraron circuitos en este país." });
        }

        res.json(circuits); // 📦 Enviar la lista de circuitos encontrados en el país
    } catch (error) {
        console.error("❌ Error al obtener circuitos por país:", error);
        res.status(500).json({ error: "Error al obtener circuitos por país: " + error.message });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
