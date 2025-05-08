import express from "express";
import Team from "../models/team.js"; // 🏆 Modelo que representa los equipos de F1 en la base de datos

const router = express.Router();

// 🏎️ Obtener todos los equipos registrados en la base de datos (GET)
router.get("/", async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        console.error("❌ Error al obtener los equipos:", error);
        res.status(500).json({ error: "Error al obtener los equipos: " + error.message });
    }
});

// 🔍 Obtener un equipo por nombre (GET)
router.get("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const team = await Team.findOne({ nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true });

        if (!team) {
            return res.status(404).json({ error: "❌ Equipo no encontrado o no fue creado manualmente." });
        }

        res.json(team);
    } catch (error) {
        console.error("❌ Error al obtener el equipo:", error);
        res.status(500).json({ error: "Error al obtener el equipo: " + error.message });
    }
});

// 🌍 Obtener equipos por nacionalidad (GET)
router.get("/nacionalidad/:pais", async (req, res) => {
    try {
        const { pais } = req.params;
        const teams = await Team.find({ nacionalidad: new RegExp(`^${pais}$`, "i") });

        if (teams.length === 0) {
            return res.status(404).json({ error: "No se encontraron equipos con esta nacionalidad." });
        }

        res.json(teams);
    } catch (error) {
        console.error("❌ Error al obtener equipos por nacionalidad:", error);
        res.status(500).json({ error: "Error al obtener equipos por nacionalidad: " + error.message });
    }
});

// 🔥 Guardar un nuevo equipo en la BD (POST)
router.post("/", async (req, res) => {
    try {
        const nuevoEquipo = new Team({ ...req.body, creadoManualmente: true }); // ✅ Indicar que fue creado manualmente
        await nuevoEquipo.save();
        res.status(201).json({ mensaje: "✅ Equipo guardado correctamente", equipo: nuevoEquipo });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al guardar el equipo" });
    }
});

// 🔄 **Actualizar un equipo creado manualmente (PUT)**
router.put("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const equipoActualizado = await Team.findOneAndUpdate(
            { nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true },
            req.body,
            { new: true }
        );

        if (!equipoActualizado) {
            return res.status(404).json({ error: "❌ Equipo no encontrado o no fue creado manualmente." });
        }

        res.json({ mensaje: "✅ Equipo actualizado correctamente", equipo: equipoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el equipo." });
    }
});

// 🛠 **Actualizar parcialmente un equipo creado manualmente (PATCH)**
router.patch("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const equipoActualizado = await Team.findOneAndUpdate(
            { nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true },
            { $set: req.body }, // ✅ Permitir actualización parcial con `$set`
            { new: true }
        );

        if (!equipoActualizado) {
            return res.status(404).json({ error: "❌ Equipo no encontrado o no fue creado manualmente." });
        }

        res.json({ mensaje: "✅ Equipo actualizado parcialmente con PATCH", equipo: equipoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar parcialmente el equipo." });
    }
});

// 🗑️ **Eliminar un equipo solo si fue creado manualmente (DELETE)**
router.delete("/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const equipoEliminado = await Team.findOneAndDelete(
            { nombre: new RegExp(`^${nombre}$`, "i"), creadoManualmente: true }
        );

        if (!equipoEliminado) {
            return res.status(404).json({ error: "❌ Equipo no encontrado o no fue creado manualmente." });
        }

        res.json({ mensaje: "✅ Equipo eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar el equipo." });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
