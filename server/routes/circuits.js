const express = require("express");
const Circuit = require("../models/circuit"); // Importamos el modelo de MongoDB

const router = express.Router();

// 📌 Obtener todos los circuitos
router.get("/", async (req, res) => {
    try {
        const circuits = await Circuit.find();
        res.json(circuits);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los circuitos: " + error.message });
    }
});

// 📌 Obtener un circuito por su ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const circuit = await Circuit.findOne({ circuitId: Number(id) });
        if (!circuit) {
            return res.status(404).json({ error: "Circuito no encontrado" });
        }
        res.json(circuit);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el circuito: " + error.message });
    }
});

// 📌 Obtener circuitos por país
router.get("/pais/:country", async (req, res) => {
    try {
        const { country } = req.params;
        const circuits = await Circuit.find({ "location.country": country });
        res.json(circuits);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener circuitos por país: " + error.message });
    }
});

module.exports = router;
