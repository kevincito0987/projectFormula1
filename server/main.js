import axios from "axios";
import { connectDB } from "./data/mongoDb.js";
import Piloto from "./models/piloto.js"; // Importa el modelo de MongoDB

connectDB();
// 🏎️ **Obtener todos los pilotos y asignarles un ID secuencial y guardar en MongoDB**
const asignarDriverId = async () => {
    try {
      const pilotos = await Piloto.find(); // Obtener todos los pilotos
      
      for (let piloto of pilotos) {
        piloto.driverId = generarDriverId(piloto); // Asignar driverId
        await piloto.save(); // Guardar cambios
      }
  
      console.log("Driver ID asignado correctamente a todos los pilotos.");
    } catch (error) {
      console.error("Error asignando Driver ID:", error);
    }
  };
  
  // Función para generar un driverId único (puedes modificarla)
  const generarDriverId = (piloto) => {
    return `DRV-${piloto._id.toString().slice(-6)}`;
  };
  
  // Llamar a la función
  asignarDriverId();
  