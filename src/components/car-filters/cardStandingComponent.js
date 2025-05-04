const teamImages = {
    team1: "https://images.ps-aws.com/c?url=https%3A%2F%2Fd3cm515ijfiu6w.cloudfront.net%2Fwp-content%2Fuploads%2F2024%2F01%2F05154013%2Fmclaren-team-photo.jpg",
    team2: "https://pbs.twimg.com/media/Fhx2X1pXgAASf9h?format=jpg&name=4096x4096",
    team3: "https://www.racefans.net/wp-content/uploads/2024/12/racefansdotnet-24-12-18-09-34-25-2-SI202412150012.jpg",
    team4: "https://cdn.ferrari.com/cms/network/media/img/resize/6095148f9e39fb0514497f02-ferrari-magazine-N214ydVuZ9.jpg?",
    team5: "https://s1.cdn.autoevolution.com/images/news/gallery/williams-f1-team-unveils-all-new-2025-fw47-race-car-looks-like-it-means-business_2.jpg",
    team6: "https://media.formula1.com/image/upload/content/dam/fom-website/manual/2023/Haas/Haas%20VF23.jpg",
    team7: "https://cdn-6.motorsport.com/images/amp/6AEogmE6/s1000/sebastian-vettel-aston-martin-.jpg",
    team8: "https://img.stcrm.it/images/35901193/HOR_WIDE/800x/si202402090078-hires-jpeg-24bit-rgb.jpeg",
    team9: "https://www.pmw-magazine.com/wp-content/uploads/2024/03/BWT-Alpine-F1-Team-2024-Formula-1-Bahrain-Grand-Prix-Saturday-e1709570488560.jpg",
    team10: "https://www.pitinsider.com/content/images/2025/02/horner----rbcp--3---8-.webp"
};

class StandingsCardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const container = document.createElement("div");
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(auto-fit, minmax(210px, 1fr))";
        container.style.gap = "1rem";

        this.shadowRoot.appendChild(container);

        const [standingsData, driversData, carsData] = await Promise.all([
            this.fetchStandingsData(),
            this.fetchDriversData(),
            this.fetchCarsData()
        ]);

        this.renderStandings(container, standingsData.drivers_championship, driversData, carsData);
    }

    async fetchStandingsData() {
        try {
            const response = await fetch("https://f1api.dev/api/current/drivers-championship");
            if (!response.ok) throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de standings`);
            return await response.json();
        } catch (error) {
            console.error(`❌ Error al obtener standings:`, error.message);
            return { drivers_championship: [] };
        }
    }

    async fetchDriversData() {
        try {
            const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers");
            if (!response.ok) throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de pilotos`);
            return await response.json();
        } catch (error) {
            console.error(`❌ Error al obtener datos de pilotos:`, error.message);
            return [];
        }
    }

    async fetchCarsData() {
        try {
            const response = await fetch("https://projectformula1-production.up.railway.app/api/cars");
            if (!response.ok) throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de autos`);
            return await response.json();
        } catch (error) {
            console.error(`❌ Error al obtener datos de autos:`, error.message);
            return [];
        }
    }

    renderStandings(container, driversChampionship, driversData, carsData) {
        if (!driversChampionship || driversChampionship.length === 0) {
            container.innerHTML = `<p class="text-gray-500 mt-4">❌ No hay datos disponibles de standings.</p>`;
            return;
        }

        driversChampionship.slice(0, 20).forEach(driverStandings => {
            // 📌 **Buscar la imagen del piloto en la API de drivers**
            const driverInfo = driversData.find(driver => driver.driverId === driverStandings.driverId);
            const driverImage = driverInfo?.url || "https://www.formula1.com/default_driver.jpg";

            // 📌 **Obtener el auto correcto basado en el equipo del piloto**
            const teamCars = carsData.find(carEntry => carEntry.equipo === driverStandings.team.teamName);
            const carImage = teamCars?.autos[0]?.imagen || "https://www.formula1.com/default_car.jpg"; // 🔥 Imagen del auto del equipo

            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <style>
                    .card {
                        padding: 1.5rem;
                        border-radius: 0.75rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                        transition: transform 0.2s;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                    }
                    .card:hover {
                        transform: scale(1.05);
                        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
                        background: var(--color-3);
                    }
                    .driver-img {
                        width: 90px;
                        height: 90px;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 3px solid #fff;
                    }
                    .car-img {
                        width: 120px;
                        height: auto;
                        border-radius: 8px;
                        object-fit: cover;
                    }
                    .info {
                        text-align: center;
                    }
                    h3 {
                        color: var(--color-1);
                    }
                    p
                    {
                        color: var(--color-1);
                    }
                </style>
                <div class="card">
                    <img src="${driverImage}" alt="${driverStandings.driver.name}" class="driver-img">
                    <div class="info">
                        <h3 class="text-xl font-bold text-white">${driverStandings.driver.name} ${driverStandings.driver.surname}</h3>
                        <p class="text-sm text-gray-400">🏎️ Equipo: ${driverStandings.team.teamName}</p>
                        <p class="text-sm text-gray-400">🔢 Posición: ${driverStandings.position} | ⭐ Victorias: ${driverStandings.wins} | 🎯 Puntos: ${driverStandings.points}</p>
                    </div>
                    <img src="${carImage}" alt="Auto de ${driverStandings.driver.name}" class="car-img">
                </div>
            `;

            container.appendChild(card);
        });

        console.log(`✅ Standings renderizados correctamente con imágenes de pilotos y autos.`);
    }
}

// 🚀 **Registrar el Web Component**
customElements.define("standings-card-component", StandingsCardComponent);
