const express = require("express");
const Session = require("../models/sesions");
const router = express.Router();

// 📝 **Crear una nueva sesión** (POST)
router.post("/:userType", async (req, res) => {
    const { sessionId, userData, timestamp } = req.body;
    const { userType } = req.params;

    try {
        // 🔎 Validar datos antes de guardar
        if (!sessionId || !userData || !timestamp) {
            return res.status(400).json({ success: false, message: "❌ Datos incompletos." });
        }

        // 📝 Insertar sesión en MongoDB
        const newSession = new Session({
            sessionId,
            userType,
            userData,
            timestamp,
        });

        await newSession.save();
        res.status(201).json({ success: true, message: "✅ Sesión guardada.", session: newSession });

    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al guardar sesión.", error });
    }
});

// 🔎 **Obtener todas las sesiones (solo Admin)**
router.get("/admin/all", async (req, res) => {
    try {
        const sessions = await Session.find({ userType: "admin" });
        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al obtener sesiones de Admin.", error });
    }
});

// 🔎 **Obtener sesiones según el usuario**
router.get("/:userType", async (req, res) => {
    try {
        const sessions = await Session.find({ userType: req.params.userType });
        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al obtener sesiones.", error });
    }
});

// ✏️ **Actualizar una sesión específica** (PUT)
router.put("/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const { userData, timestamp } = req.body;

    try {
        // 🔎 Verificar si la sesión existe
        const updatedSession = await Session.findOneAndUpdate(
            { sessionId },
            { userData, timestamp },
            { new: true }
        );

        if (!updatedSession) {
            return res.status(404).json({ success: false, message: "❌ Sesión no encontrada." });
        }

        res.json({ success: true, message: "✅ Sesión actualizada.", session: updatedSession });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al actualizar sesión.", error });
    }
});

// ❌ **Eliminar una sesión** (DELETE)
router.delete("/:sessionId", async (req, res) => {
    const { sessionId } = req.params;

    try {
        const deletedSession = await Session.findOneAndDelete({ sessionId });

        if (!deletedSession) {
            return res.status(404).json({ success: false, message: "❌ Sesión no encontrada." });
        }

        res.json({ success: true, message: "✅ Sesión eliminada.", session: deletedSession });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error al eliminar sesión.", error });
    }
});

module.exports = router;
