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
        cards[index].querySelector("img").src = driver.image;
        cards[index].querySelector("h3").textContent = `🏎️ ${driver.name} - ${driver.team}`;
        cards[index].querySelector("p").textContent = `📊 Estadísticas: ${driver.stats}`;
        cards[index].querySelector("a").href = driver.profile_url || "#"; // 🔗 Si hay enlace de perfil en la API
    });

    console.log("✅ Pilotos actualizados correctamente en las tarjetas.");
}

// 🔥 Llamamos la función para obtener los datos y reemplazar la info en las cards
fetchDriversData();
