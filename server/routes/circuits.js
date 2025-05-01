const express = require("express");
const Circuit = require("../models/circuits");

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

// 📌 Obtener un circuito por `circuitId`
router.get("/:circuitId", async (req, res) => {
    try {
        const { circuitId } = req.params;
        const circuit = await Circuit.findOne({ circuitId: circuitId });

        if (!circuit) {
            return res.status(404).json({ error: "Circuito no encontrado" });
        }

        res.json(circuit);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el circuito: " + error.message });
    }
});

// 📌 Obtener circuitos por país
router.get("/pais/:pais", async (req, res) => {
    try {
        const { pais } = req.params;
        const circuits = await Circuit.find({ pais: pais });

        if (circuits.length === 0) {
            return res.status(404).json({ error: "No se encontraron circuitos en este país." });
        }

        res.json(circuits);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener circuitos por país: " + error.message });
    }
});

module.exports = router;
