// 🏆 Función para obtener datos de standings con imágenes de la API de pilotos
async function fetchStandingsData() {
    const standingsUrl = "https://f1api.dev/api/current/drivers-championship";
    const driversUrl = "https://projectformula1-production.up.railway.app/api/drivers";

    try {
        const [standingsResponse, driversResponse] = await Promise.all([
            fetch(standingsUrl),
            fetch(driversUrl)
        ]);

        if (!standingsResponse.ok || !driversResponse.ok) {
            throw new Error("❌ Error al obtener los datos de las APIs.");
        }

        const standingsData = await standingsResponse.json();
        const driversData = await driversResponse.json();

        if (!standingsData.drivers_championship || !Array.isArray(driversData)) {
            throw new Error("❌ Datos corruptos o vacíos.");
        }

        // 🔍 Fusionar standings con la imagen correspondiente desde la API de pilotos
        const enrichedStandings = standingsData.drivers_championship.map(standing => {
            const driverMatch = driversData.find(driver => driver.nombre === standing.driver.name);
            return {
                ...standing,
                driver: {
                    ...standing.driver,
                    image: driverMatch ? driverMatch.url : "https://www.formula1.com/default_driver.jpg"
                }
            };
        });

        return enrichedStandings;
    } catch (error) {
        console.error("❌ Error al obtener standings con imágenes:", error.message);
        return [];
    }
}

// 🏆 Función para reemplazar la información en las tarjetas con standings y su imagen correcta
function replaceStandingsCards(standingsData) {
    const cards = document.querySelectorAll(".grid .card");
    if (cards.length < 8) {
        console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
        return;
    }

    standingsData.forEach((driver, index) => {
        cards[index].querySelector("img").src = driver.driver.image;
        cards[index].querySelector("h3").textContent = `🏆 ${driver.driver.name} - ${driver.team.teamName}`;
        cards[index].querySelector("p").textContent = `Posición: ${driver.position} | Puntos: ${driver.points}`;
        cards[index].querySelector("a").href = driver.driver.url || "#";
    });

    console.log("✅ Standings con imágenes actualizados correctamente.");
}

// 🏎️ Función para obtener datos según el filtro seleccionado (Pilotos, Equipos y Circuitos)
async function fetchFilteredData(filter = "All Drivers") {
    const apiUrls = {
        "All Drivers": "https://projectformula1-production.up.railway.app/api/drivers",
        "F1 Teams": "https://projectformula1-production.up.railway.app/api/teams",
        "F1 Circuits": "https://projectformula1-production.up.railway.app/api/circuits"
    };

    try {
        const apiUrl = apiUrls[filter];
        if (!apiUrl) throw new Error(`❌ Filtro no válido: ${filter}`);

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo obtener la data.`);

        let data = await response.json();

        if (!data || Object.keys(data).length === 0) {
            throw new Error(`❌ Datos vacíos o corruptos para ${filter}`);
        }

        replaceCards(data.slice(0, 8), filter);
    } catch (error) {
        console.error(`❌ Error al obtener datos de ${filter}:`, error.message);
    }
}

// 🏎️ Función para reemplazar la información en las tarjetas de Pilotos, Equipos y Circuitos
function replaceCards(data, filter) {
    const cards = document.querySelectorAll(".grid .card");
    if (cards.length < 8) {
        console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
        return;
    }

    data.slice(0, 8).forEach((item, index) => {
        if (filter === "All Drivers") {
            cards[index].querySelector("img").src = item.url;
            cards[index].querySelector("h3").textContent = `🏎️ ${item.nombre} ${item.apellido} - ${item.team}`;
            cards[index].querySelector("p").textContent = `📆 Nacimiento: ${item.fechaNacimiento} | 🇬🇧 Nacionalidad: ${item.nacionalidad}`;
            cards[index].querySelector("a").href = `https://www.formula1.com/en/drivers/${item.driverId}.html` || "#";
        } else if (filter === "F1 Teams") {
            cards[index].querySelector("h3").textContent = `🏎️ ${item.nombre} - ${item.pais}`;
            cards[index].querySelector("p").textContent = `Fundado: ${item.fundacion} | 📍 Sede: ${item.sede}`;
            cards[index].querySelector("img").src = item.logo;
            cards[index].querySelector("a").href = item.url || "#";
        } else if (filter === "F1 Circuits") {
            cards[index].querySelector("h3").textContent = `📍 ${item.nombre} - ${item.pais}`;
            cards[index].querySelector("p").textContent = `Ubicación: ${item.ciudad} | 🏁 Longitud: ${item.longitud} km`;
            cards[index].querySelector("img").src = item.urlImagen;
            cards[index].querySelector("a").href = item.link || "#";
        }
    });

    console.log(`✅ Datos actualizados con el filtro: ${filter}`);
}

// 🔥 Detectar clics en los botones de la imagen y aplicar filtros
document.addEventListener("DOMContentLoaded", async () => {
    const filtersContainer = document.querySelector("cars-links");

    filtersContainer.addEventListener("news-selected", async (event) => {
        const selectedFilter = event.detail.newsType;
        console.log(`🔎 Aplicando filtro: ${selectedFilter}`);

        if (selectedFilter === "F1 Standings") {
            const standingsData = await fetchStandingsData();
            if (standingsData.length > 0) {
                replaceStandingsCards(standingsData);
            }
        } else {
            await fetchFilteredData(selectedFilter);
        }
    });

    // 🔥 Cargar datos iniciales con `"All Drivers"`
    fetchFilteredData("All Drivers");
});

// 🔥 Exportar funciones para uso global
export { fetchFilteredData, replaceCards, fetchStandingsData, replaceStandingsCards };
    