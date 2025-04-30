const mongoose = require("mongoose");

const pilotoSchema = new mongoose.Schema({
    driverId: String,
    nombre: String,
    apellido: String,
    nacionalidad: String,
    fechaNacimiento: String,
    numero: Number,
    nombreCorto: String,
    url: String,
});

const Piloto = mongoose.model("Piloto", pilotoSchema, "drivers");
module.exports = Piloto;
