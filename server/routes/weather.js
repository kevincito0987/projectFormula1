// 📦 Importar módulos esenciales para manejar rutas y modelos
import express from "express";
import Weather from "../models/weather.js"; // 🌍 Modelo que representa los registros climáticos en la base de datos

const router = express.Router();

// 🌤️ Obtener todos los registros de clima disponibles
router.get("/", async (req, res) => {
    try {
        const weatherData = await Weather.find(); // 🔍 Consulta de todos los registros climáticos
        res.json(weatherData); // 📦 Respuesta con la lista completa de registros
    } catch (error) {
        console.error("❌ Error al obtener los datos de clima:", error);
        res.status(500).json({ error: "Error al obtener los datos de clima: " + error.message });
    }
});

// 🔍 Obtener clima por categoría (soleado, lluvioso, nublado, ventoso, extremo)
router.get("/categoria/:tipo", async (req, res) => {
    try {
        const { tipo } = req.params; // 📋 Extraer la categoría climática desde los parámetros
        const weatherData = await Weather.find({ categoria: tipo }); // 🔎 Buscar registros que coincidan con la categoría

        if (weatherData.length === 0) {
            return res.status(404).json({ error: "No se encontraron registros en esta categoría." });
        }

        res.json(weatherData); // 📦 Enviar la lista de registros encontrados
    } catch (error) {
        console.error("❌ Error al filtrar por categoría:", error);
        res.status(500).json({ error: "Error al filtrar por categoría: " + error.message });
    }
});

// 📅 Obtener clima por fecha específica
router.get("/fecha/:date", async (req, res) => {
    try {
        const { date } = req.params; // 🗓️ Extraer la fecha desde los parámetros
        const weatherData = await Weather.find({ date }); // 🔎 Buscar registros climáticos en la fecha indicada

        if (weatherData.length === 0) {
            return res.status(404).json({ error: "No se encontraron registros en esta fecha." });
        }

        res.json(weatherData); // 📦 Enviar la lista de registros encontrados
    } catch (error) {
        console.error("❌ Error al filtrar por fecha:", error);
        res.status(500).json({ error: "Error al filtrar por fecha: " + error.message });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
