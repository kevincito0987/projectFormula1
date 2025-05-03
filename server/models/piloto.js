// 📦 Importar Mongoose para definir el esquema de los pilotos de F1
import mongoose from "mongoose";

// 🏁 Esquema de Piloto - Define la estructura de los datos de cada piloto en la base de datos
const pilotoSchema = new mongoose.Schema({
    driverId: String, // 🔢 Identificador único del piloto
    nombre: String, // 🏆 Nombre del piloto
    apellido: String, // 🏎️ Apellido del piloto
    nacionalidad: String, // 🌍 País de origen del piloto
    fechaNacimiento: String, // 📅 Fecha de nacimiento del piloto
    numero: Number, // 🔢 Número de competencia del piloto
    nombreCorto: String, // 🏁 Nombre corto o alias del piloto
    url: String, // 🔗 Enlace con información detallada del piloto
    team: String, // 🔧 Nombre del equipo al que pertenece el piloto
});

// 📌 Creación del modelo de MongoDB basado en el esquema definido
const Piloto = mongoose.model("Piloto", pilotoSchema, "drivers");

// 📦 Exportar el modelo para su uso en otras partes del proyecto
export default Piloto;
