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

// 🔍 Obtener un circuito por nombre (GET)
router.get("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const circuito = await Circuit.findOne({ nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true });

        if (!circuito) {
            return res.status(404).json({ error: "❌ Circuito no encontrado o no fue creado manualmente." });
        }

        res.json(circuito);
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
        res.status500.json({ error: "Error al obtener circuitos por país: " + error.message });
    }
});

// 🔥 Guardar un nuevo circuito en la BD (POST)
router.post("/", async (req, res) => {
    try {
        const nuevoCircuito = new Circuit({ ...req.body, creadoManualmente: true }); // ✅ Indicar que fue creado manualmente
        await nuevoCircuito.save();
        res.status(201).json({ mensaje: "✅ Circuito guardado correctamente", circuito: nuevoCircuito });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al guardar el circuito" });
    }
});

// 🔄 **Actualizar un circuito creado manualmente (PUT)**
router.put("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const circuitoActualizado = await Circuit.findOneAndUpdate(
            { nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true },
            req.body,
            { new: true }
        );

        if (!circuitoActualizado) {
            return res.status(404).json({ error: "❌ Circuito no encontrado o no fue creado manualmente." });
        }

        res.json({ mensaje: "✅ Circuito actualizado correctamente", circuito: circuitoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el circuito." });
    }
});
// 🔄 **Actualizar un circuito creado manualmente (PUT)**
router.put("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const circuitoActualizado = await Circuit.findOneAndUpdate(
            { nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true },
            req.body,
            { new: true }
        );

        if (!circuitoActualizado) {
            return res.status(404).json({ error: "❌ Circuito no encontrado o no fue creado manualmente." });
        }

        res.json({ mensaje: "✅ Circuito actualizado correctamente", circuito: circuitoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el circuito." });
    }
});

// 🛠 **Actualizar parcialmente un circuito creado manualmente (PATCH)**
router.patch("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const circuitoActualizado = await Circuit.findOneAndUpdate(
            { nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true },
            { $set: req.body }, // ✅ Permitir actualización parcial con `$set`
            { new: true }
        );

        if (!circuitoActualizado) {
            return res.status(404).json({ error: "❌ Circuito no encontrado o no fue creado manualmente." });
        }

        res.json({ mensaje: "✅ Circuito actualizado parcialmente con PATCH", circuito: circuitoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar parcialmente el circuito." });
    }
});


// 🗑️ **Eliminar un circuito solo si fue creado manualmente (DELETE)**
router.delete("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const circuitoEliminado = await Circuit.findOneAndDelete(
            { nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true }
        );

        if (!circuitoEliminado) {
            return res.status(404).json({ error: "❌ Circuito no encontrado o no fue creado manualmente." });
        }

        res.json({ mensaje: "✅ Circuito eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar el circuito." });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
