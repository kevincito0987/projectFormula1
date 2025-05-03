// 📦 Importar módulos esenciales para manejar rutas y modelos
import express from "express";
import News from "../models/news.js"; // 📌 Importar el modelo de noticias

const router = express.Router();

// 🔍 Obtener todas las noticias de F1
router.get("/", async (req, res) => {
    try {
        const noticias = await News.find();
        res.json(noticias);
    } catch (error) {
        res.status(500).json({ error: "❌ Error al obtener noticias" });
    }
});

// 🔍 Obtener una noticia específica por ID
router.get("/:id", async (req, res) => {
    try {
        const noticia = await News.findById(req.params.id);
        if (!noticia) return res.status(404).json({ error: "❌ Noticia no encontrada" });

        res.json(noticia);
    } catch (error) {
        res.status(500).json({ error: "❌ Error al obtener la noticia" });
    }
});

// 🔥 Guardar una nueva noticia en la BD
router.post("/", async (req, res) => {
    try {
        const nuevaNoticia = new News(req.body);
        await nuevaNoticia.save();
        res.status(201).json({ mensaje: "✅ Noticia guardada correctamente", noticia: nuevaNoticia });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al guardar la noticia" });
    }
});

// 🗑️ Eliminar una noticia por ID
router.delete("/:id", async (req, res) => {
    try {
        const noticiaEliminada = await News.findByIdAndDelete(req.params.id);
        if (!noticiaEliminada) return res.status(404).json({ error: "❌ Noticia no encontrada" });

        res.json({ mensaje: "✅ Noticia eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al eliminar la noticia" });
    }
});

// 🔄 Actualizar una noticia por ID
router.put("/:id", async (req, res) => {
    try {
        const noticiaActualizada = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!noticiaActualizada) return res.status(404).json({ error: "❌ Noticia no encontrada" });

        res.json({ mensaje: "✅ Noticia actualizada correctamente", noticia: noticiaActualizada });
    } catch (error) {
        res.status(500).json({ error: "❌ Error al actualizar la noticia" });
    }
});

// 📦 Exportar el router para ES Modules
export default router;
