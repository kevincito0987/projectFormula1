// 📦 Importar módulos esenciales para manejar rutas y modelos
const express = require("express");
const Driver = require("../models/piloto"); // 🏎️ Importa el modelo de piloto desde la base de datos

const router = express.Router();

// 🏆 Obtener todos los pilotos registrados en la base de datos
router.get("/", async (req, res) => {
    try {
        const drivers = await Driver.find(); // 🔎 Consulta de todos los pilotos disponibles
        res.json(drivers); // 📦 Respuesta con la lista completa de pilotos
    } catch (error) {
        console.error("❌ Error al obtener los pilotos:", error); // ⚠️ Registro de error en consola
        res.status(500).json({ error: "Error al obtener los pilotos: " + error.message });
    }
});

// 🔍 Obtener un piloto por `driverId`
router.get("/:driverId", async (req, res) => {
    try {
        const { driverId } = req.params; // 📋 Extraer el ID del piloto desde los parámetros
        const driver = await Driver.findOne({ driverId: driverId }); // 🔎 Buscar el piloto por su ID único

        if (!driver) {
            return res.status(404).json({ error: "Piloto no encontrado" }); // 🚨 Manejo de error si no existe el piloto
        }

        res.json(driver); // 📦 Enviar los detalles del piloto encontrado
    } catch (error) {
        console.error("❌ Error al obtener el piloto:", error); // ⚠️ Registro de error en consola
        res.status(500).json({ error: "Error al obtener el piloto: " + error.message });
    }
});

// 🔧 Obtener pilotos por equipo
router.get("/team/:team", async (req, res) => {
    try {
        const { team } = req.params; // 🏁 Extraer el nombre del equipo desde los parámetros
        const drivers = await Driver.find({ team: team }); // 🔍 Buscar los pilotos que pertenecen al equipo

        if (drivers.length === 0) {
            return res.status(404).json({ error: "No se encontraron pilotos en este equipo." }); // 🚨 Manejo de error si no hay pilotos en el equipo
        }

        res.json(drivers); // 📦 Enviar la lista de pilotos encontrados
    } catch (error) {
        console.error("❌ Error al obtener pilotos por equipo:", error); // ⚠️ Registro de error en consola
        res.status(500).json({ error: "Error al obtener pilotos por equipo: " + error.message });
    }
});

// 🌍 Obtener pilotos por nacionalidad
router.get("/nacionalidad/:pais", async (req, res) => {
    try {
        const { pais } = req.params; // 🌎 Extraer la nacionalidad desde los parámetros
        const drivers = await Driver.find({ nacionalidad: pais }); // 🔍 Buscar pilotos según la nacionalidad

        if (drivers.length === 0) {
            return res.status(404).json({ error: "No se encontraron pilotos con esta nacionalidad." }); // 🚨 Manejo de error si no hay pilotos con esa nacionalidad
        }

        res.json(drivers); // 📦 Enviar la lista de pilotos encontrados
    } catch (error) {
        console.error("❌ Error al obtener pilotos por nacionalidad:", error); // ⚠️ Registro de error en consola
        res.status(500).json({ error: "Error al obtener pilotos por nacionalidad: " + error.message });
    }
});

// 📦 Exportar el router para su uso en el servidor principal
module.exports = router;
