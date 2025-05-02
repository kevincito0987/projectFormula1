// 📦 Importar módulos esenciales para manejar rutas y modelos
const express = require("express");
const Team = require("../models/team"); // 🏆 Modelo que representa los equipos de F1 en la base de datos

const router = express.Router();

// 🏎️ Obtener todos los equipos registrados en la base de datos
router.get("/", async (req, res) => {
    try {
        const teams = await Team.find(); // 🔍 Consulta de todos los equipos disponibles
        res.json(teams); // 📦 Respuesta con la lista completa de equipos
    } catch (error) {
        console.error("❌ Error al obtener los equipos:", error); // ⚠️ Registro de error en consola
        res.status(500).json({ error: "Error al obtener los equipos: " + error.message });
    }
});

// 🔍 Obtener un equipo por `teamId`
router.get("/:teamId", async (req, res) => {
    try {
        const { teamId } = req.params; // 📋 Extraer el ID del equipo desde los parámetros
        const team = await Team.findOne({ teamId: teamId }); // 🔎 Buscar el equipo por su ID único

        if (!team) {
            return res.status(404).json({ error: "Equipo no encontrado" }); // 🚨 Manejo de error si el equipo no existe
        }

        res.json(team); // 📦 Enviar los detalles del equipo encontrado
    } catch (error) {
        console.error("❌ Error al obtener el equipo:", error); // ⚠️ Registro de error en consola
        res.status(500).json({ error: "Error al obtener el equipo: " + error.message });
    }
});

// 🌍 Obtener equipos por nacionalidad
router.get("/nacionalidad/:pais", async (req, res) => {
    try {
        const { pais } = req.params; // 🏁 Extraer el país desde los parámetros
        const teams = await Team.find({ nacionalidad: pais }); // 🔎 Buscar equipos por nacionalidad

        if (teams.length === 0) {
            return res.status(404).json({ error: "No se encontraron equipos con esta nacionalidad." }); // 🚨 Manejo de error si no hay equipos de ese país
        }

        res.json(teams); // 📦 Enviar la lista de equipos encontrados
    } catch (error) {
        console.error("❌ Error al obtener equipos por nacionalidad:", error); // ⚠️ Registro de error en consola
        res.status(500).json({ error: "Error al obtener equipos por nacionalidad: " + error.message });
    }
});

// 📦 Exportar el router para su uso en el servidor principal
module.exports = router;
