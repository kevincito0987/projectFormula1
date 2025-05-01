const express = require("express");
const Team = require("../models/team"); // Asegurar que el modelo esté correctamente importado

const router = express.Router();

// 📌 Obtener todos los equipos
router.get("/", async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los equipos: " + error.message });
    }
});

// 📌 Obtener un equipo por `teamId`
router.get("/:teamId", async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findOne({ teamId: teamId });

        if (!team) {
            return res.status(404).json({ error: "Equipo no encontrado" });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el equipo: " + error.message });
    }
});

// 📌 Obtener equipos por nacionalidad
router.get("/nacionalidad/:pais", async (req, res) => {
    try {
        const { pais } = req.params;
        const teams = await Team.find({ nacionalidad: pais });

        if (teams.length === 0) {
            return res.status(404).json({ error: "No se encontraron equipos con esta nacionalidad." });
        }

        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener equipos por nacionalidad: " + error.message });
    }
});

// 📌 Obtener el equipo con más campeonatos de constructores
router.get("/mas-campeonatos-constructores", async (req, res) => {
    try {
        const topConstructorTeam = await Team.find()
            .sort({ campeonatosConstructores: -1 }) // Orden descendente
            .limit(1);

        if (topConstructorTeam.length === 0) {
            return res.status(404).json({ error: "No hay registros de campeonatos de constructores disponibles." });
        }

        res.json(topConstructorTeam[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el equipo con más campeonatos de constructores: " + error.message });
    }
});

// 📌 Obtener el equipo con más campeonatos de pilotos
router.get("/mas-campeonatos-pilotos", async (req, res) => {
    try {
        const topDriverChampionshipTeam = await Team.find()
            .sort({ campeonatosPilotos: -1 }) // Orden descendente
            .limit(1);

        if (topDriverChampionshipTeam.length === 0) {
            return res.status(404).json({ error: "No hay registros de campeonatos de pilotos disponibles." });
        }

        res.json(topDriverChampionshipTeam[0]);
    } catch (error) {
        res.status500().json({ error: "Error al obtener el equipo con más campeonatos de pilotos: " + error.message });
    }
});

module.exports = router;
