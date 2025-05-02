// 📦 Importar Mongoose para definir el esquema de los equipos de F1
const mongoose = require("mongoose");

// 🏁 Esquema de Equipo - Define la estructura de los datos de cada equipo en la base de datos
const teamSchema = new mongoose.Schema({
    teamId: String, // 🔢 Identificador único del equipo
    nombre: String, // 🏆 Nombre oficial del equipo en la competición
    nacionalidad: String, // 🌍 País de origen del equipo
    primeraAparicion: String, // 📅 Año en que el equipo debutó en la F1
    campeonatosConstructores: Number, // 🏎️ Número de títulos de constructores obtenidos
    campeonatosPilotos: Number, // 🏆 Cantidad de campeonatos ganados por sus pilotos
    url: String, // 🔗 Enlace con información detallada sobre el equipo
});

// 📌 Creación del modelo de MongoDB basado en el esquema definido
const Team = mongoose.model("Team", teamSchema, "teams");

// 📦 Exportar el modelo para su uso en otras partes del proyecto
module.exports = Team;
