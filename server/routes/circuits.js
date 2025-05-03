import express from "express";
import Circuit from "../models/circuits.js";

const router = express.Router();

// 🏎️ Obtener todos los circuitos registrados en la base de datos (GET)
router.get("/", async (req, res) => {
    try {
        const circuits = await Circuit.find();
        res.json(circuits);
    } catch (error) {
        console.error("❌ Error al obtener los circuitos:", error);
        res.status(500).json({ error: "Error al obtener los circuitos: " + error.message });
    }
});

// 🔍 Obtener un circuito por `circuitId` (GET)
router.get("/:circuitId", async (req, res) => {
    try {
        const { circuitId } = req.params;
        const circuit = await Circuit.findOne({ circuitId });

        if (!circuit) {
            return res.status(404).json({ error: "Circuito no encontrado" });
        }

        res.json(circuit);
    } catch (error) {
        console.error("❌ Error al obtener el circuito:", error);
        res.status(500).json({ error: "Error al obtener el circuito: " + error.message });
    }
});

// 🌍 Obtener circuitos por país (GET)
router.get("/pais/:pais", async (req, res) => {
    try {
        const { pais } = req.params;
        const circuits = await Circuit.find({ pais });

        if (circuits.length === 0) {
            return res.status(404).json({ error: "No se encontraron circuitos en este país." });
        }

        res.json(circuits);
    } catch (error) {
        console.error("❌ Error al obtener circuitos por país:", error);
        res.status(500).json({ error: "Error al obtener circuitos por país: " + error.message });
    }
});

// 🔥 Guardar un nuevo circuito en la BD (POST)
router.post("/", async (req, res) => {
    try {
        const nuevoCircuito = new Circuit(req.body);
        await nuevoCircuito.save();
        res.status(201).json({ mensaje: "✅ Circuito guardado correctamente", circuito: nuevoCircuito });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al guardar el circuito" });
    }
});

// 🔄 Actualizar un circuito por `circuitId` (PUT)
router.put("/:circuitId", async (req, res) => {
    try {
        const circuitoActualizado = await Circuit.findOneAndUpdate(
            { circuitId: req.params.circuitId },
            req.body,
            { new: true }
        );

        if (!circuitoActualizado) {
            return res.status(404).json({ error: "❌ Circuito no encontrado" });
        }

        res.json({ mensaje: "✅ Circuito actualizado correctamente", circuito: circuitoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el circuito" });
    }
});

// 🗑️ Eliminar un circuito por `circuitId` (DELETE)
router.delete("/:circuitId", async (req, res) => {
    try {
        const circuitoEliminado = await Circuit.findOneAndDelete({ circuitId: req.params.circuitId });

        if (!circuitoEliminado) {
            return res.status(404).json({ error: "❌ Circuito no encontrado" });
        }

        res.json({ mensaje: "✅ Circuito eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar el circuito" });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
