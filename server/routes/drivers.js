const express = require("express");
const Driver = require("../models/driver"); // Asegurar que el modelo esté correctamente importado

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

// 📌 Obtener piloto más joven
router.get("/mas-joven", async (req, res) => {
    try {
        const youngestDriver = await Driver.find()
            .sort({ fechaNacimiento: -1 }) // Ordena de más reciente a más antiguo
            .limit(1);

        if (youngestDriver.length === 0) {
            return res.status(404).json({ error: "No hay registros de edad disponibles." });
        }

        res.json(youngestDriver[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el piloto más joven: " + error.message });
    }
});

// 📌 Obtener piloto con el número más bajo
router.get("/numero-minimo", async (req, res) => {
    try {
        const driverWithLowestNumber = await Driver.find({ numero: { $exists: true, $gt: 0 } })
            .sort({ numero: 1 }) // Ordena de menor a mayor número
            .limit(1);

        if (driverWithLowestNumber.length === 0) {
            return res.status(404).json({ error: "No hay registros de número disponibles." });
        }

        res.json(driverWithLowestNumber[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el piloto con el número más bajo: " + error.message });
    }
});

module.exports = router;
