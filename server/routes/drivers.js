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

// 🔍 Obtener un equipo por `teamId` (GET)
router.get("/:teamId", async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findOne({ teamId });

        if (!team) {
            return res.status(404).json({ error: "Equipo no encontrado" });
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
        const teams = await Team.find({ nacionalidad: pais });

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
        const nuevoEquipo = new Team(req.body);
        await nuevoEquipo.save();
        res.status(201).json({ mensaje: "✅ Equipo guardado correctamente", equipo: nuevoEquipo });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al guardar el equipo" });
    }
});

// 🔄 Actualizar un equipo por `teamId` (PUT)
router.put("/:teamId", async (req, res) => {
    try {
        const equipoActualizado = await Team.findOneAndUpdate(
            { teamId: req.params.teamId },
            req.body,
            { new: true }
        );

        if (!equipoActualizado) {
            return res.status(404).json({ error: "❌ Equipo no encontrado" });
        }

        res.json({ mensaje: "✅ Equipo actualizado correctamente", equipo: equipoActualizado });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el equipo" });
    }
});

// 🗑️ Eliminar un equipo por `teamId` (DELETE)
router.delete("/:teamId", async (req, res) => {
    try {
        const equipoEliminado = await Team.findOneAndDelete({ teamId: req.params.teamId });

        if (!equipoEliminado) {
            return res.status(404).json({ error: "❌ Equipo no encontrado" });
        }

        res.json({ mensaje: "✅ Equipo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar el equipo" });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
