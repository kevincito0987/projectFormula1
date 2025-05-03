import express from "express";
import Piloto from "../models/piloto.js"; // 🏎️ Modelo de pilotos de F1 en la base de datos

const router = express.Router();

// 🏎️ Obtener todos los pilotos registrados en la base de datos (GET)
router.get("/", async (req, res) => {
    try {
        const pilotos = await Piloto.find();
        res.json(pilotos);
    } catch (error) {
        console.error("❌ Error al obtener los pilotos:", error);
        res.status(500).json({ error: "Error al obtener los pilotos: " + error.message });
    }
});

// 🔍 Obtener un piloto por `driverId` (GET)
router.get("/:driverId", async (req, res) => {
    try {
        const { driverId } = req.params;
        const piloto = await Piloto.findOne({ driverId });

        if (!piloto) {
            return res.status(404).json({ error: "Piloto no encontrado" });
        }

        res.json(piloto);
    } catch (error) {
        console.error("❌ Error al obtener el piloto:", error);
        res.status(500).json({ error: "Error al obtener el piloto: " + error.message });
    }
});

// 🌍 Obtener pilotos por nacionalidad (GET)
router.get("/nacionalidad/:pais", async (req, res) => {
    try {
        const { pais } = req.params;
        const pilotos = await Piloto.find({ nacionalidad: pais });

        if (pilotos.length === 0) {
            return res.status(404).json({ error: "No se encontraron pilotos con esta nacionalidad." });
        }

        res.json(pilotos);
    } catch (error) {
        console.error("❌ Error al obtener pilotos por nacionalidad:", error);
        res.status(500).json({ error: "Error al obtener pilotos por nacionalidad: " + error.message });
    }
});

// 🔥 Guardar un nuevo piloto en la BD (POST)
router.post("/", async (req, res) => {
    try {
        const nuevoPiloto = new Piloto(req.body);
        await nuevoPiloto.save();
        res.status(201).json({ mensaje: "✅ Piloto guardado correctamente", piloto: nuevoPiloto });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al guardar el piloto" });
    }
});

// 🔄 Actualizar un piloto por `driverId` (PUT)
router.put("/:driverId", async (req, res) => {
    try {
        const pilotoActualizado = await Piloto.findOneAndUpdate(
            { driverId: req.params.driverId },
            req.body,
            { new: true }
        );

        if (!pilotoActualizado) {
            return res.status(404).json({ error: "❌ Piloto no encontrado" });
        }

        res.json({ mensaje: "✅ Piloto actualizado correctamente", piloto: pilotoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el piloto" });
    }
});

// 🗑️ Eliminar un piloto por `driverId` (DELETE)
router.delete("/:driverId", async (req, res) => {
    try {
        const pilotoEliminado = await Piloto.findOneAndDelete({ driverId: req.params.driverId });

        if (!pilotoEliminado) {
            return res.status(404).json({ error: "❌ Piloto no encontrado" });
        }

        res.json({ mensaje: "✅ Piloto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar el piloto" });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
