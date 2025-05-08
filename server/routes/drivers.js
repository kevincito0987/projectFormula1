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

// 🔍 Obtener un piloto por `id` o `driverId` (GET)
router.get("/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;
        
        let piloto = await Piloto.findOne({ id: identifier });
        if (!piloto) piloto = await Piloto.findOne({ driverId: identifier });

        if (!piloto) {
            return res.status(404).json({ error: "❌ Piloto no encontrado." });
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
            return res.status(404).json({ error: "❌ No se encontraron pilotos con esta nacionalidad." });
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
        res.status(500).json({ error: "❌ Error al guardar el piloto." });
    }
});

// 🔄 Actualizar un piloto por `id` o `driverId` (PUT)
router.put("/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;

        let pilotoActualizado = await Piloto.findOneAndUpdate({ id: identifier }, req.body, { new: true });
        if (!pilotoActualizado) {
            pilotoActualizado = await Piloto.findOneAndUpdate({ driverId: identifier }, req.body, { new: true });
        }

        if (!pilotoActualizado) {
            return res.status(404).json({ error: "❌ Piloto no encontrado." });
        }

        res.json({ mensaje: "✅ Piloto actualizado correctamente", piloto: pilotoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el piloto." });
    }
});

// 🗑️ Eliminar un piloto por `id` o `driverId` (DELETE)
router.delete("/:identifier", async (req, res) => {
    try {
        const { identifier } = req.params;

        let pilotoEliminado = await Piloto.findOneAndDelete({ id: identifier });
        if (!pilotoEliminado) {
            pilotoEliminado = await Piloto.findOneAndDelete({ driverId: identifier });
        }

        if (!pilotoEliminado) {
            return res.status(404).json({ error: "❌ Piloto no encontrado." });
        }

        res.json({ mensaje: "✅ Piloto eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar el piloto." });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
