const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
    airTemperature: Number,       // Temperatura del aire (°C)
    date: String,                 // Fecha y hora en formato ISO 8601
    humidity: Number,             // Humedad relativa (%)
    meetingKey: Number,           // Identificador único de la reunión
    pressure: Number,             // Presión del aire (mbar)
    rainfall: Boolean,            // Indica si hay lluvia (0: no, 1: sí)
    sessionKey: Number,           // Identificador único de la sesión
    trackTemperature: Number,     // Temperatura de la pista (°C)
    windDirection: Number,        // Dirección del viento (°), de 0° a 359°
    windSpeed: Number,
    categoria: String,             // Velocidad del viento (m/s)
});

const Weather = mongoose.model("Weather", weatherSchema, "weather");
module.exports = Weather;
