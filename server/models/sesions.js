// 📦 Importar Mongoose para definir el esquema de datos de sesión
import mongoose from "mongoose";

// 🔐 Esquema de Sesión - Define la estructura de datos para sesiones de Admin y Usuario
const sessionSchema = new mongoose.Schema({
    sessionId: String, // 🔢 Identificador único de la sesión
    userType: { type: String, enum: ["admin", "user"], required: true }, // 👤 Tipo de usuario (admin o user)
    userData: Object, // 📄 Datos específicos del usuario (preferencias, configuración, etc.)
    timestamp: { type: Date, default: Date.now }, // ⏱️ Fecha y hora de creación de la sesión
});

// 📌 Creación del modelo de MongoDB basado en el esquema definido
const Session = mongoose.model("Session", sessionSchema, "sessions");

// 📦 Exportar el modelo para ES Modules
export default Session;
