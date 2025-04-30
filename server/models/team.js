const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    teamId: String,
    nombre: String,
    nacionalidad: String,
    primeraAparicion: String,
    campeonatosConstructores: Number,
    campeonatosPilotos: Number,
    url: String,
});

const Team = mongoose.model("Team", teamSchema, "teams");
module.exports = Team;
