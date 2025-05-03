import { closeModal, showUpdateDriverModal, submitNewDriver, showAddDriverModal, renderDrivers, deleteDriver, updateDriver, addDriver, fetchDrivers } from "./crudCars.js";
import { getFromIndexedDB, saveToIndexedDB } from "../../../server/data/indexedDb.js";

// 🏆 **Función para obtener datos de standings desde IndexedDB o API**

async function fetchStandingsData() {
    const storeName = "standings";
    const cachedData = await getFromIndexedDB(storeName);

    if (cachedData.length > 0) {
        console.log("✅ Standings obtenidos desde IndexedDB.");
        return cachedData;
    }

    console.log("🔄 No hay datos en IndexedDB, obteniendo desde API...");
    const standingsUrl = "https://f1api.dev/api/current/drivers-championship";
    const driversUrl = "https://projectformula1-production.up.railway.app/api/drivers";

    try {
        const [standingsResponse, driversResponse] = await Promise.all([fetch(standingsUrl), fetch(driversUrl)]);
        if (!standingsResponse.ok || !driversResponse.ok) throw new Error("❌ Error al obtener los datos de las APIs.");

        const standingsData = await standingsResponse.json();
        const driversData = await driversResponse.json();

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

        await saveToIndexedDB(storeName, enrichedStandings);
        console.log("✅ Standings guardados en IndexedDB.");
        return enrichedStandings;
    } catch (error) {
        console.error("❌ Error al obtener standings con imágenes:", error.message);
        return [];
    }
}
// 🏎️ **Función para obtener datos filtrados desde IndexedDB o API**
async function fetchFilteredData(filter = "All Drivers") {
    const storeName = filter === "All Drivers" ? "drivers" : filter === "F1 Teams" ? "teams" : "circuits";

    try {
        // 📌 Verificar si IndexedDB tiene datos
        const cachedData = await getFromIndexedDB(storeName);
        if (cachedData.length > 0) {
            console.log(`✅ Datos de ${filter} obtenidos desde IndexedDB.`);
            replaceCards(cachedData.slice(0, 8), filter);
            return;
        }

        console.log(`🔄 No hay datos en IndexedDB, obteniendo desde API...`);
        const apiUrls = {
            "All Drivers": "https://projectformula1-production.up.railway.app/api/drivers",
            "F1 Teams": "https://projectformula1-production.up.railway.app/api/teams",
            "F1 Circuits": "https://projectformula1-production.up.railway.app/api/circuits"
        };

        const response = await fetch(apiUrls[filter]);
        if (!response.ok) {
            throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de ${filter}`);
        }

        const data = await response.json();

        // ⚡ Asignar ID genérico si falta
        const enrichedData = data.map(item => ({
            id: item.id || `admin-generated-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            ...item
        }));

        await saveToIndexedDB(storeName, enrichedData);
        console.log(`✅ Datos de ${filter} guardados en IndexedDB.`);
        replaceCards(enrichedData.slice(0, 8), filter);

    } catch (error) {
        console.error(`❌ Error al obtener datos de ${filter}:`, error.message);
    }
}

function replaceStandingsCards(standingsData) {
    const cards = document.querySelectorAll(".grid .card");

    if (!cards || cards.length < 8) {
        console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
        return;
    }

    if (!standingsData || standingsData.length === 0) {
        console.error("❌ Error: Datos de standings vacíos.");
        return;
    }

    standingsData.forEach((driver, index) => {
        if (!cards[index]) {
            console.error(`⚠ Advertencia: No hay tarjeta disponible para el índice ${index}.`);
            return;
        }

        cards[index].querySelector("img").src = driver.driver.image || "https://www.formula1.com/default_driver.jpg";
        cards[index].querySelector("h3").textContent = `🏆 ${driver.driver.name} - ${driver.team.teamName}`;
        cards[index].querySelector("p").textContent = `Posición: ${driver.position} | Puntos: ${driver.points}`;
        cards[index].querySelector("a").href = driver.driver.url || "#";
    });

    console.log("✅ Standings con imágenes actualizados correctamente.");
}




const teamImages = {
    team1: "https://images.ps-aws.com/c?url=https%3A%2F%2Fd3cm515ijfiu6w.cloudfront.net%2Fwp-content%2Fuploads%2F2024%2F01%2F05154013%2Fmclaren-team-photo.jpg",
    team2: "https://pbs.twimg.com/media/Fhx2X1pXgAASf9h?format=jpg&name=4096x4096",
    team3: "https://www.racefans.net/wp-content/uploads/2024/12/racefansdotnet-24-12-18-09-34-25-2-SI202412150012.jpg",
    team4: "https://cdn.ferrari.com/cms/network/media/img/resize/6095148f9e39fb0514497f02-ferrari-magazine-N214ydVuZ9.jpg?",
    team5: "https://s1.cdn.autoevolution.com/images/news/gallery/williams-f1-team-unveils-all-new-2025-fw47-race-car-looks-like-it-means-business_2.jpg",
    team6: "https://media.formula1.com/image/upload/content/dam/fom-website/manual/2023/Haas/Haas%20VF23.jpg",
    team7: "https://cdn-6.motorsport.com/images/amp/6AEogmE6/s1000/sebastian-vettel-aston-martin-.jpg",
    team8: "https://img.stcrm.it/images/35901193/HOR_WIDE/800x/si202402090078-hires-jpeg-24bit-rgb.jpeg"
};

async function replaceCards(data, filter) {
    const cards = document.querySelectorAll(".grid .card");
    if (cards.length < 8) {
        console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
        return;
    }

    localStorage.setItem("activeFilter", filter);

    cards.forEach(async (card, index) => {
        if (index >= data.length) return;
        const item = data[index];

        // ⚡ Asignar un ID genérico si no tiene uno
        if (!item.id) {
            item.id = `admin-generated-${Date.now()}-${index}`;
            console.warn(`⚠ Se asignó un ID genérico: ${item.id}`);
        }

        if (filter === "All Drivers" || filter === "F1 Standings") {
            card.querySelector("img").src = item.url;
            card.querySelector("h3").textContent = `🏎️ ${item.nombre} - ${item.team}`;
            card.querySelector("p").textContent = `📆 Nacimiento: ${item.fechaNacimiento} | 🇬🇧 Nacionalidad: ${item.nacionalidad}`;
            card.querySelector("a").href = `https://www.formula1.com/en/drivers/${item.driverId}.html` || "#";

        } else if (filter === "F1 Teams") {
            card.querySelector("h3").textContent = `🏎️ ${item.nombre} - ${item.nacionalidad}`;
            card.querySelector("p").textContent = `Fundado: ${item.primeraAparicion} | 📍 Sede: ${item.nacionalidad}`;
            card.querySelector("img").src = item.logo ? item.logo : teamImages[`team${index + 1}`] || "https://www.formula1.com/default_team.jpg";
            card.querySelector("a").href = item.url || "#";

        } else if (filter === "F1 Circuits") {
            card.querySelector("h3").textContent = `📍 ${item.nombre} - ${item.pais}`;
            card.querySelector("p").textContent = `Ciudad: ${item.ciudad} | 🏁 Longitud: ${item.longitud}m`;
            card.querySelector("img").src = item.urlImagen;
            card.querySelector("a").href = item.url || "#";
        }
    });

    console.log(`✅ Datos actualizados con el filtro: ${filter}`);
}



// 🏎️ Persistencia del filtro en `localStorage`
document.addEventListener("DOMContentLoaded", async () => {
    const savedFilter = localStorage.getItem("activeFilter") || "All Drivers";
    await fetchFilteredData(savedFilter);
});

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
