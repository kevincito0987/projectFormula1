const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
    circuito: String,
    fecha: String,
    temperatura: Number,
    humedad: Number,
    velocidadViento: Number,
    condiciones: String,
});

const Weather = mongoose.model("Weather", weatherSchema, "weather");
module.exports = Weather;
