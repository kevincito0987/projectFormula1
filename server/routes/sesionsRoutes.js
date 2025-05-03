const express = require("express");
const Session = require("../models/sesions");
const router = express.Router();

// 🔄 Guardar sesión en MongoDB
router.post("/sync", async (req, res) => {
    try {
        await Session.insertMany(req.body.sessions);
        res.json({ success: true, message: "✅ Sesiones guardadas en MongoDB Atlas." });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al guardar sesiones.", error });
    }
});

// 🔎 Obtener sesiones por tipo de usuario
router.get("/:userType", async (req, res) => {
    try {
        const sessions = await Session.find({ userType: req.params.userType });
        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al obtener sesiones.", error });
    }
});

module.exports = router;
