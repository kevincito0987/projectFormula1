// 📦 Importar Mongoose para definir el esquema de las noticias
import mongoose from "mongoose";

// 📰 Esquema de Noticias - Define la estructura de los datos de cada artículo en la base de datos
const NewsSchema = new mongoose.Schema({
    article_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    keywords: { type: [String], default: [] },
    creator: { type: String, default: "Desconocido" },
    description: { type: String, default: "Sin descripción disponible" },
    pubDate: { type: Date, required: true },
    image_url: { type: String, default: "" },
    source_name: { type: String, required: true },
    source_icon: { type: String, default: "" },
    category: { type: [String], default: [] },
    language: { type: String, default: "english" }
});

// 📌 Creación del modelo de MongoDB basado en el esquema definido
const News = mongoose.model("News", NewsSchema);

// 📦 Exportar el modelo para su uso en otras partes del proyecto
export default News;
