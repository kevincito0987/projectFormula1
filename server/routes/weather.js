const express = require("express");
const Weather = require("../models/weather"); // Importamos el modelo de MongoDB

const router = express.Router();

// 📌 Obtener todos los registros de clima
router.get("/", async (req, res) => {
    try {
        const weatherData = await Weather.find();
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los datos de clima: " + error.message });
    }
});

// 📌 Obtener clima por categoría (soleado, lluvioso, nublado, ventoso, extremo)
router.get("/categoria/:tipo", async (req, res) => {
    try {
        const { tipo } = req.params;
        const weatherData = await Weather.find({ categoria: tipo });
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por categoría: " + error.message });
    }
});

// 📌 Obtener clima por fecha específica
router.get("/fecha/:date", async (req, res) => {
    try {
        const { date } = req.params;
        const weatherData = await Weather.find({ date });
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por fecha: " + error.message });
    }
});

module.exports = router;
