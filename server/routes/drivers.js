// 📦 Importar módulos esenciales para manejar rutas y modelos
import express from "express";
import Driver from "../models/piloto.js"; // 🏎️ Importa el modelo de piloto desde la base de datos

const router = express.Router();

// 🏆 Obtener todos los pilotos registrados en la base de datos
router.get("/", async (req, res) => {
    try {
        const drivers = await Driver.find(); // 🔎 Consulta de todos los pilotos disponibles
        res.json(drivers); // 📦 Respuesta con la lista completa de pilotos
    } catch (error) {
        console.error("❌ Error al obtener los pilotos:", error);
        res.status(500).json({ error: "Error al obtener los pilotos: " + error.message });
    }
});

// 🔍 Obtener un piloto por `driverId`
router.get("/:driverId", async (req, res) => {
    try {
        const { driverId } = req.params; // 📋 Extraer el ID del piloto desde los parámetros
        const driver = await Driver.findOne({ driverId }); // 🔎 Buscar el piloto por su ID único

        if (!driver) {
            return res.status(404).json({ error: "Piloto no encontrado" });
        }

        res.json(driver); // 📦 Enviar los detalles del piloto encontrado
    } catch (error) {
        console.error("❌ Error al obtener el piloto:", error);
        res.status(500).json({ error: "Error al obtener el piloto: " + error.message });
    }
});

// 🔧 Obtener pilotos por equipo
router.get("/team/:team", async (req, res) => {
    try {
        const { team } = req.params; // 🏁 Extraer el nombre del equipo desde los parámetros
        const drivers = await Driver.find({ team }); // 🔍 Buscar los pilotos que pertenecen al equipo

        if (drivers.length === 0) {
            return res.status(404).json({ error: "No se encontraron pilotos en este equipo." });
        }

        res.json(drivers); // 📦 Enviar la lista de pilotos encontrados
    } catch (error) {
        console.error("❌ Error al obtener pilotos por equipo:", error);
        res.status(500).json({ error: "Error al obtener pilotos por equipo: " + error.message });
    }
});

// 🌍 Obtener pilotos por nacionalidad
router.get("/nacionalidad/:pais", async (req, res) => {
    try {
        const { pais } = req.params; // 🌎 Extraer la nacionalidad desde los parámetros
        const drivers = await Driver.find({ nacionalidad: pais }); // 🔍 Buscar pilotos según la nacionalidad

        if (drivers.length === 0) {
            return res.status(404).json({ error: "No se encontraron pilotos con esta nacionalidad." });
        }

        res.json(drivers); // 📦 Enviar la lista de pilotos encontrados
    } catch (error) {
        console.error("❌ Error al obtener pilotos por nacionalidad:", error);
        res.status(500).json({ error: "Error al obtener pilotos por nacionalidad: " + error.message });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
