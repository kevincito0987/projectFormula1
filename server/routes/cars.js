const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 📌 Cargar el archivo JSON de carros
const carsFilePath = path.join(__dirname, "../data/dataCars.json");

// 📌 Obtener todos los autos agrupados por equipo
router.get("/", async (req, res) => {
    try {
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));

        // Convertir el objeto "equipos" en un array de valores
        const equiposArray = Object.values(carsData.equipos);

        // Estructurar la salida como equipos con sus autos
        const formattedCars = equiposArray.map(team => ({
            equipo: team.equipo,
            autos: team.autos
        }));

        res.json(formattedCars);
    } catch (error) {
        res.status(500).json({ error: "Error al cargar los datos de autos: " + error.message });
    }
});

// 📌 Obtener un auto por `modelo`
router.get("/:modelo", async (req, res) => {
    try {
        const { modelo } = req.params;
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));

        // Convertir el objeto "equipos" en un array de valores
        const equiposArray = Object.values(carsData.equipos);

        // Buscar el auto en todos los equipos
        const car = equiposArray.flatMap(team => team.autos).find(auto => auto.modelo.toLowerCase() === modelo.toLowerCase());

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

        // Convertir el objeto "equipos" en un array de valores
        const equiposArray = Object.values(carsData.equipos);

        // Buscar los autos dentro del equipo
        const teamData = equiposArray.find(e => e.equipo.toLowerCase() === team.toLowerCase());

        if (!teamData) {
            return res.status(404).json({ error: "Equipo no encontrado." });
        }

        res.json({ equipo: teamData.equipo, autos: teamData.autos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los autos por equipo: " + error.message });
    }
});

module.exports = router;
