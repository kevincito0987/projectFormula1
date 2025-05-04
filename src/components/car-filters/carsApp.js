async function fetchDriversData() {
    const apiUrl = "https://projectformula1-production.up.railway.app/api/drivers";
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo obtener la data.`);

        const driversData = await response.json();
        if (!driversData || driversData.length === 0) throw new Error("❌ Datos vacíos o corruptos");

        replaceDriverCards(driversData); // 🔄 Reemplaza la info de las tarjetas
    } catch (error) {
        console.error("❌ Error al obtener conductores:", error.message);
    }
}

// 🏎️ Función para reemplazar la información en las tarjetas
function replaceDriverCards(driversData) {
    const cards = document.querySelectorAll(".grid .card");

    if (cards.length < 8) {
        console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
        return;
    }

    driversData.slice(0, 8).forEach((driver, index) => {
        cards[index].querySelector("img").src = driver.url; // 🔥 Usa el `url` de la API como imagen
        cards[index].querySelector("h3").textContent = `🏎️ ${driver.nombre} ${driver.apellido} - ${driver.team}`;
        cards[index].querySelector("p").textContent = `📆 Nacimiento: ${driver.fechaNacimiento} | 🇬🇧 Nacionalidad: ${driver.nacionalidad}`;
        cards[index].querySelector("a").href = `https://www.formula1.com/en/drivers/${driver.driverId}.html` || "#"; // 🔗 Genera un enlace basado en su ID
    });

    console.log("✅ Pilotos actualizados correctamente en las tarjetas.");
}

// 🔥 Llamamos la función para obtener los datos y reemplazar la info en las cards
fetchDriversData();
