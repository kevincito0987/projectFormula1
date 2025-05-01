// 📦 Importar Mongoose para definir el esquema de los circuitos
const mongoose = require("mongoose");

// 🏁 Esquema de Circuito - Define la estructura de los datos de cada circuito de F1
const circuitSchema = new mongoose.Schema({
    circuitId: String, // 🔢 Identificador único del circuito
    nombre: String, // 🏆 Nombre oficial del circuito
    pais: String, // 🌍 País donde está ubicado el circuito
    ciudad: String, // 🏙️ Ciudad donde se encuentra el circuito
    longitud: Number, // 📏 Longitud total del circuito en kilómetros
    lapRecord: String, // ⏱️ Récord de vuelta más rápida en la pista
    primerAñoParticipacion: Number, // 📅 Año en que el circuito debutó en la F1
    numeroCurvas: Number, // 🔄 Número total de curvas en el trazado
    pilotoVueltaRapida: String, // 🏎️ Nombre del piloto que tiene el récord de vuelta rápida
    equipoVueltaRapida: String, // 🔧 Equipo al que pertenece el piloto con la vuelta más rápida
    añoVueltaRapida: Number, // 🗓️ Año en que se logró el récord de vuelta rápida
    url: String, // 🔗 Enlace con información detallada del circuito
    urlImagen: String, // 📸 URL de la imagen representativa del circuito
});

// 📌 Creación del modelo de MongoDB basado en el esquema definido
const Circuit = mongoose.model("Circuit", circuitSchema, "circuits");

// 📦 Exportar el modelo para su uso en otras partes del proyecto
module.exports = Circuit;
