const mongoose = require("mongoose");

const pilotoSchema = new mongoose.Schema({
    id: Number,
    nombre: String,
    equipo: String,
    rol: String,
    estadisticas: Object, // Puedes adaptar según los datos de la API
});

const Piloto = mongoose.model("Piloto", pilotoSchema);
module.exports = Piloto;
