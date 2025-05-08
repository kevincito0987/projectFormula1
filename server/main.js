import axios from "axios";
import { connectDB } from "./data/mongoDb.js";
import Piloto from "./models/piloto.js"; // Importa el modelo de MongoDB

connectDB();
const eliminarPilotosKevinAngarita = async () => {
  try {
      await connectDB(); // ✅ Asegura que la BD esté conectada

      const resultado = await Piloto.deleteMany({ nombre: "Jhon", apellido: "Angarita" }); // 🔥 Eliminar todos los que coincidan

      if (resultado.deletedCount === 0) {
          console.warn("⚠️ No se encontraron pilotos con el nombre 'Jhon ' y apellido 'Angarita'.");
      } else {
          console.log(`✅ Se eliminaron ${resultado.deletedCount} pilotos llamados 'Jhon Angarita'.`);
      }
  } catch (error) {
      console.error("❌ Error eliminando pilotos 'Kevin Angarita':", error);
  }
};

// 🔥 **Ejecutar la función**
eliminarPilotosKevinAngarita();



  