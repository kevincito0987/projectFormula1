const express = require("express");
const Session = require("../models/sesions");
const router = express.Router();

// 🔎 Obtener todas las sesiones (solo para Admin)
router.get("/admin/all", async (req, res) => {
    try {
        const sessions = await Session.find({ userType: "admin" });
        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al obtener sesiones de Admin.", error });
    }
});

// 🔎 Obtener sesiones individuales según el usuario
router.get("/:userType", async (req, res) => {
    try {
        const sessions = await Session.find({ userType: req.params.userType });
        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al obtener sesiones.", error });
    }
});

module.exports = router;
