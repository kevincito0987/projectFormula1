import "../car-filters/cardTeamComponent.js";
import "../car-filters/cardCircuitComponents.js";
import "../car-filters/cardStandingComponent.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".grid");
    if (!container) {
        console.error("❌ Error: No se encontró el contenedor de tarjetas.");
        return;
    }

    // 📌 **Mostrar pilotos por defecto al cargar**
    updateComponent("card-component", "All Drivers");

    // 📌 **Escuchar eventos desde `cars-links`**
    document.addEventListener("news-selected", async (event) => {
        const filter = event.detail.newsType;
        console.log(`🔄 Cambiando a filtro: ${filter}`);

        let componentTag = "card-component"; // 🔥 Pilotos por defecto
        if (filter === "F1 Teams") componentTag = "team-card-component";
        if (filter === "F1 Circuits") componentTag = "circuit-card-component";
        if (filter === "F1 Standings") componentTag = "standings-card-component";

        updateComponent(componentTag, filter);
    });

    async function updateComponent(componentTag, filterName) {
        container.innerHTML = ""; // 🧹 Limpiar componente previo

        const newComponent = document.createElement(componentTag);
        newComponent.setAttribute("filter", filterName);

        // 📌 **Para `F1 Standings`, obtener datos de la API**
        if (filterName === "F1 Standings") {
            const data = await fetchStandingsData();
            newComponent.setAttribute("data-items", JSON.stringify(data));
        }

        container.appendChild(newComponent);
        console.log(`✅ Se cambió al componente: ${componentTag} con filtro: ${filterName}`);
    }

    async function fetchStandingsData() {
        try {
            console.log(`🔄 Obteniendo datos de standings desde la API...`);
            const response = await fetch("https://f1api.dev/api/current/drivers-championship");

            if (!response.ok) {
                throw new Error(`❌ Error ${response.status}: No se pudo obtener la data`);
            }

            const jsonData = await response.json();
            console.log(`📊 Data recibida:`, jsonData);
            return jsonData.drivers_championship || [];
        } catch (error) {
            console.error(`❌ Error al obtener standings:`, error.message);
            return [];
        }
    }
});


