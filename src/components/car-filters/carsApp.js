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

// 🏎️ Variable con imágenes de equipos
// 🏎️ Variable con imágenes de equipos
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
async function fetchPilotsByTeam(teamId) {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers");
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudieron obtener los pilotos.`);

        const driversData = await response.json();
        return driversData.filter(driver => driver.team === teamId);
    } catch (error) {
        console.error(`❌ Error al obtener pilotos del equipo ${teamId}:`, error.message);
        return [];
    }
}

async function replaceCards(data, filter) {
    const cards = document.querySelectorAll(".grid .card");
    if (cards.length < 8) {
        console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
        return;
    }

    // 🏎️ Guardar el filtro en `localStorage` para persistencia
    localStorage.setItem("activeFilter", filter);

    cards.forEach(async (card, index) => {
        if (index >= data.length) return;
        const item = data[index];

        if (filter === "All Drivers" || filter === "F1 Standings") {
            card.querySelector("img").src = item.url;
            card.querySelector("h3").textContent = `🏎️ ${item.nombre} ${item.apellido} - ${item.team}`;
            card.querySelector("p").textContent = `📆 Nacimiento: ${item.fechaNacimiento} | 🇬🇧 Nacionalidad: ${item.nacionalidad}`;
            card.querySelector("a").href = `https://www.formula1.com/en/drivers/${item.driverId}.html` || "#";

            let pilotsContainer = card.querySelector(".pilots-section");
            if (pilotsContainer) pilotsContainer.style.display = "none";

        } else if (filter === "F1 Teams") {
            card.querySelector("h3").textContent = `🏎️ ${item.nombre} - ${item.nacionalidad}`;
            card.querySelector("p").textContent = `Fundado: ${item.primeraAparicion} | 📍 Sede: ${item.nacionalidad}`;

            const teamKey = `team${index + 1}`;
            card.querySelector("img").src = item.logo ? item.logo : teamImages[teamKey] || "https://www.formula1.com/default_team.jpg";
            card.querySelector("a").href = item.url || "#";

            const pilots = await fetchPilotsByTeam(item.teamId);
            let pilotsContainer = card.querySelector(".pilots-section");

            if (!pilotsContainer) {
                pilotsContainer = document.createElement("div");
                pilotsContainer.classList.add("pilots-section", "mt-4", "border-t", "border-gray-500", "pt-2");
                card.appendChild(pilotsContainer);
            }

            pilotsContainer.innerHTML = "";
            pilotsContainer.style.display = "block";

            const title = document.createElement("h4");
            title.textContent = "🏎️ Pilotos del equipo:";
            title.classList.add("text-lg", "font-bold", "mt-2", "text-center");
            pilotsContainer.appendChild(title);

            pilots.forEach(pilot => {
                const pilotWrapper = document.createElement("div");
                pilotWrapper.classList.add("flex", "items-center", "justify-center", "gap-4", "mt-2");

                const pilotImage = document.createElement("img");
                pilotImage.src = pilot.url;
                pilotImage.alt = pilot.nombre;
                pilotImage.classList.add("w-12", "h-12", "rounded-full", "border", "border-gray-400");

                const pilotInfo = document.createElement("p");
                pilotInfo.textContent = `🔹 ${pilot.nombre} ${pilot.apellido} (${pilot.numero})`;
                pilotInfo.classList.add("text-sm", "text-center");

                pilotWrapper.appendChild(pilotImage);
                pilotWrapper.appendChild(pilotInfo);
                pilotsContainer.appendChild(pilotWrapper);
            });
        } else if (filter === "F1 Circuits") {
            // 🔥 Ajustar datos según la estructura de la API de circuitos
            card.querySelector("h3").textContent = `📍 ${item.nombre} - ${item.pais}`;
            card.querySelector("p").textContent = `Ciudad: ${item.ciudad} | 🏁 Longitud: ${item.longitud}m`;
            card.querySelector("img").src = item.urlImagen;
            card.querySelector("a").href = item.url || "#";

            let pilotsContainer = card.querySelector(".pilots-section");
            if (pilotsContainer) pilotsContainer.style.display = "none";
        }
    });

    console.log(`✅ Datos actualizados con el filtro: ${filter}`);
}

// 🔥 **Persistir el filtro al recargar la página**
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
