import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// 📌 Obtener la ruta absoluta del archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const carsFilePath = path.join(__dirname, "../data/dataCars.json");

// 🏎️ Obtener todos los autos agrupados por equipo (GET)
router.get("/", async (req, res) => {
    try {
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));
        const equiposArray = Object.values(carsData.equipos);

        const formattedCars = equiposArray.map(team => ({
            equipo: team.equipo,
            autos: team.autos
        }));

        res.json(formattedCars);
    } catch (error) {
        console.error("❌ Error al cargar los datos de autos:", error);
        res.status(500).json({ error: "Error al cargar los datos de autos: " + error.message });
    }
});

// 🔍 Obtener un auto por `modelo` (GET)
router.get("/:modelo", async (req, res) => {
    try {
        const { modelo } = req.params;
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));
        const equiposArray = Object.values(carsData.equipos);

        const car = equiposArray.flatMap(team => team.autos)
            .find(auto => auto.modelo.toLowerCase() === modelo.toLowerCase());

        if (!car) {
            return res.status(404).json({ error: "Auto no encontrado" });
        }

        res.json(car);
    } catch (error) {
        console.error("❌ Error al obtener el auto:", error);
        res.status(500).json({ error: "Error al obtener el auto: " + error.message });
    }
});

// 🔍 Filtrar autos por equipo (GET)
router.get("/equipo/:team", async (req, res) => {
    try {
        const { team } = req.params;
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));
        const equiposArray = Object.values(carsData.equipos);

        const teamData = equiposArray.find(e => e.equipo.toLowerCase() === team.toLowerCase());

        if (!teamData) {
            return res.status(404).json({ error: "Equipo no encontrado." });
        }

        res.json({ equipo: teamData.equipo, autos: teamData.autos });
    } catch (error) {
        console.error("❌ Error al obtener los autos por equipo:", error);
        res.status(500).json({ error: "Error al obtener los autos por equipo: " + error.message });
    }
});

// 🔥 Guardar un nuevo auto en el JSON (POST)
router.post("/", async (req, res) => {
    try {
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));
        const { equipo, nuevoAuto } = req.body;

        if (!equipo || !nuevoAuto) {
            return res.status(400).json({ error: "❌ Datos incompletos para agregar auto." });
        }

        if (!carsData.equipos[equipo]) {
            return res.status(404).json({ error: "❌ Equipo no encontrado." });
        }

        carsData.equipos[equipo].autos.push(nuevoAuto);
        fs.writeFileSync(carsFilePath, JSON.stringify(carsData, null, 2));

        res.status(201).json({ mensaje: "✅ Auto agregado correctamente", auto: nuevoAuto });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al guardar el auto" });
    }
});

// 🔄 Actualizar un auto por `modelo` (PUT)
router.put("/:modelo", async (req, res) => {
    try {
        const { modelo } = req.params;
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));
        const equiposArray = Object.values(carsData.equipos);

        let carFound = false;
        equiposArray.forEach(team => {
            team.autos.forEach((auto, index) => {
                if (auto.modelo.toLowerCase() === modelo.toLowerCase()) {
                    team.autos[index] = { ...auto, ...req.body };
                    carFound = true;
                }
            });
        });

        if (!carFound) {
            return res.status(404).json({ error: "❌ Auto no encontrado." });
        }

        fs.writeFileSync(carsFilePath, JSON.stringify(carsData, null, 2));
        res.json({ mensaje: "✅ Auto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar el auto" });
    }
});

// 🗑️ Eliminar un auto por `modelo` (DELETE)
router.delete("/:modelo", async (req, res) => {
    try {
        const { modelo } = req.params;
        const carsData = JSON.parse(fs.readFileSync(carsFilePath, "utf-8"));
        const equiposArray = Object.values(carsData.equipos);

        let carFound = false;
        equiposArray.forEach(team => {
            const index = team.autos.findIndex(auto => auto.modelo.toLowerCase() === modelo.toLowerCase());
            if (index !== -1) {
                team.autos.splice(index, 1);
                carFound = true;
            }
        });

        if (!carFound) {
            return res.status(404).json({ error: "❌ Auto no encontrado." });
        }

        fs.writeFileSync(carsFilePath, JSON.stringify(carsData, null, 2));
        res.json({ mensaje: "✅ Auto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar el auto" });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
