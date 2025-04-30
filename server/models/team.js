const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    nacionalidad: { type: String, default: "Sin nacionalidad" },
    primeraAparicion: { type: Number, default: 0 },
    campeonatosConstructores: { type: Number, default: 0 },
    campeonatosPilotos: { type: Number, default: 0 },
    url: { type: String, default: "Sin URL" },
});

module.exports = mongoose.model("Team", teamSchema);
