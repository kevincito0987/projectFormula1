// 📦 Importar Mongoose para definir el esquema de datos meteorológicos
const mongoose = require("mongoose");

// 🌤️ Esquema de Clima - Define la estructura de los datos meteorológicos en la base de datos
const weatherSchema = new mongoose.Schema({
    airTemperature: Number,       // 🌡️ Temperatura del aire en grados Celsius (°C)
    date: String,                 // 📅 Fecha y hora en formato ISO 8601
    humidity: Number,             // 💧 Porcentaje de humedad relativa en el ambiente
    meetingKey: Number,           // 🏁 Identificador único de la reunión donde se registró el clima
    pressure: Number,             // 🌬️ Presión atmosférica medida en milibares (mbar)
    rainfall: Boolean,            // ☔ Indica si hubo lluvia (true: sí, false: no)
    sessionKey: Number,           // 🔑 Identificador único de la sesión de carrera
    trackTemperature: Number,     // 🏎️ Temperatura de la pista en grados Celsius (°C)
    windDirection: Number,        // 🌪️ Dirección del viento en grados (0° a 359°)
    windSpeed: Number,            // 💨 Velocidad del viento en metros por segundo (m/s)
    categoria: String             // 📊 Clasificación meteorológica basada en velocidad del viento
});

// 📌 Creación del modelo de MongoDB basado en el esquema definido
const Weather = mongoose.model("Weather", weatherSchema, "weather");

// 📦 Exportar el modelo para su uso en otras partes del proyecto
module.exports = Weather;
