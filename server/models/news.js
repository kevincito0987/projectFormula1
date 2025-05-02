const mongoose = require("mongoose");

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

const News = mongoose.model("News", NewsSchema);
module.exports = News;
