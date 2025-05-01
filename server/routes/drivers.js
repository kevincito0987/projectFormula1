const express = require("express");
const Driver = require("../models/piloto"); // Asegurar que el modelo esté correctamente importado

const router = express.Router();

// 📌 Obtener todos los pilotos
router.get("/", async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los pilotos: " + error.message });
    }
});

// 📌 Obtener un piloto por `driverId`
router.get("/:driverId", async (req, res) => {
    try {
        const { driverId } = req.params;
        const driver = await Driver.findOne({ driverId: driverId });

        if (!driver) {
            return res.status(404).json({ error: "Piloto no encontrado" });
        }

        res.json(driver);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el piloto: " + error.message });
    }
});

// 📌 Obtener pilotos por equipo
router.get("/team/:team", async (req, res) => {
    try {
        const { team } = req.params;
        const drivers = await Driver.find({ team: team });

        if (drivers.length === 0) {
            return res.status(404).json({ error: "No se encontraron pilotos en este equipo." });
        }

        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener pilotos por equipo: " + error.message });
    }
});

// 📌 Obtener pilotos por nacionalidad
router.get("/nacionalidad/:pais", async (req, res) => {
    try {
        const { pais } = req.params;
        const drivers = await Driver.find({ nacionalidad: pais });

        if (drivers.length === 0) {
            return res.status(404).json({ error: "No se encontraron pilotos con esta nacionalidad." });
        }

        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener pilotos por nacionalidad: " + error.message });
    }
});

module.exports = router;
