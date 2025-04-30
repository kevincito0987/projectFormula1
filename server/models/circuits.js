const mongoose = require("mongoose");

const circuitSchema = new mongoose.Schema({
    circuitId: String,
    nombre: String,
    pais: String,
    ciudad: String,
    longitud: Number,
    lapRecord: String,
    primerAñoParticipacion: Number,
    numeroCurvas: Number,
    pilotoVueltaRapida: String,
    equipoVueltaRapida: String,
    añoVueltaRapida: Number,
    url: String,
    urlImagen: String,
});

const Circuit = mongoose.model("Circuit", circuitSchema, "circuits");
module.exports = Circuit;
