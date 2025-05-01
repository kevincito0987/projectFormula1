const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 📌 Cargar el archivo JSON de carros
const carsFilePath = path.join(__dirname, "../data/dataCars.json");

// 📌 Obtener todos los autos
router.get("/", async (req, res) => {
    try {
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));

        // Verificar que carsData es un array antes de usar .flatMap()
        if (!Array.isArray(carsData)) {
            return res.status(500).json({ error: "Formato incorrecto en dataCars.json, se esperaba un array." });
        }

        // Extraer todos los autos de los equipos
        const allCars = carsData.map(team => team.autos).flat();

        res.json(allCars);
    } catch (error) {
        res.status(500).json({ error: "Error al cargar los datos de autos: " + error.message });
    }
});

// 📌 Obtener un auto por `modelo`
router.get("/:modelo", async (req, res) => {
    try {
        const { modelo } = req.params;
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));

        if (!Array.isArray(carsData)) {
            return res.status(500).json({ error: "Formato incorrecto en dataCars.json, se esperaba un array." });
        }

        // Buscar el auto en todos los equipos
        const car = carsData.map(team => team.autos).flat().find(auto => auto.modelo.toLowerCase() === modelo.toLowerCase());

        if (!car) {
            return res.status(404).json({ error: "Auto no encontrado" });
        }

        res.json(car);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el auto: " + error.message });
    }
});

// 📌 Filtrar autos por equipo
router.get("/equipo/:team", async (req, res) => {
    try {
        const { team } = req.params;
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));

        if (!Array.isArray(carsData)) {
            return res.status(500).json({ error: "Formato incorrecto en dataCars.json, se esperaba un array." });
        }

        // Buscar los autos dentro del equipo
        const teamData = carsData.find(e => e.equipo.toLowerCase() === team.toLowerCase());

        if (!teamData || !Array.isArray(teamData.autos) || teamData.autos.length === 0) {
            return res.status(404).json({ error: "No se encontraron autos para este equipo." });
        }

        res.json(teamData.autos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los autos por equipo: " + error.message });
    }
});

module.exports = router;
