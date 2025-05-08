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

class TeamCardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // 🚀 Inicializa Shadow DOM
    }

    async connectedCallback() {
        const filter = this.getAttribute("filter");

        if (filter !== "F1 Teams") {
            console.error("❌ Este componente solo maneja equipos.");
            return;
        }

        const container = document.createElement("div");
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(auto-fit, minmax(420px, 1fr))";
        container.style.gap = "1rem";

        const cards = [];
        for (let i = 0; i < 10; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <style>
                    .card {
                        padding: 1.5rem;
                        border-radius: 0.75rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                        transition: transform 0.2s;
                    }
                    .card:hover {
                        transform: scale(1.05);
                        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
                        background: var(--color-3);
                    }
                    img {
                        width: 100%;
                        height: auto;
                        border-radius: 0.75rem;
                    }
                    .drivers-section {
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        margin-top: 1rem;
                    }
                    .driver {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        text-align: center;
                    }
                    .driver img {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 3px solid #fff;
                    }
                    .cars-section {
                        margin-top: 1rem;
                    }
                    .car-box {
                        padding: 10px;
                        border-radius: 10px;
                        margin-bottom: 5px;
                    }
                    .car-box h5 {
                        color: white;
                        font-weight: bold;
                    }
                    .car-box p {
                        font-size: 0.9rem;
                    }
                    .button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: var(--color-3);
                        color: #fff;
                        padding: 10px;
                        border-radius: 10px;
                        margin-top: 1rem;
                        cursor: pointer;
                        text-decoration: none;
                    }
                    .button:hover {
                        background: var(--color-4);
                        transform: scale(1.05);
                    }
                    a img {
                        width: 4rem;
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
                    <img src="https://www.formula1.com/default_team.jpg" alt="Cargando...">
                    <div class="mt-4">
                        <h3 class="text-xl font-bold text-center">Cargando...</h3>
                        <p class="text-sm mt-2 text-center">...</p>
                        <a class="button" href="#" target="_blank">
                            <img src="../assets/icons/icon2Formula1.svg" alt="Formula 1 Icon" class="w-8 h-8 ml-4">
                            <p class="text-lg font-semibold text-center w-full">Learn More...</p>
                        </a>
                        <div class="drivers-section"></div>
                        <div class="cars-section"></div>
                    </div>
                </div>
            `;
            cards.push(card);
            container.appendChild(card);
        }

        this.shadowRoot.appendChild(container);

        const [teamsData, driversData, carsData] = await Promise.all([
            this.fetchFilteredData(),
            this.fetchDriversData(),
            this.fetchCarsData()
        ]);

        this.replaceCardsForTeams(cards, teamsData, driversData, carsData);
        this.animateButtons();
    }

    async fetchFilteredData() {
        try {
            const response = await fetch("https://projectformula1-production.up.railway.app/api/teams");
            if (!response.ok) throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de equipos`);
            return await response.json();
        } catch (error) {
            console.error(`❌ Error al obtener datos de equipos:`, error.message);
            return [];
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

    replaceCardsForTeams(cards, teamsData, driversData, carsData) {
        if (cards.length < 10) {
            console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
            return;
        }
    
        localStorage.setItem("activeFilter", "F1 Teams");
    
        cards.forEach((card, index) => {
            if (index >= teamsData.length) return;
            const team = teamsData[index];
    
            card.querySelector("img").src = team.logo || teamImages[`team${index + 1}`] || "https://www.formula1.com/default_team.jpg";
            card.querySelector("h3").textContent = `🏎️ ${team.nombre} - ${team.nacionalidad}`;
            card.querySelector("p").textContent = `Fundado: ${team.primeraAparicion} | 📍 Sede: ${team.nacionalidad}`;
            card.querySelector("a").href = team.url || "#";
    
            const driversSection = card.querySelector(".drivers-section");
            const carsSection = card.querySelector(".cars-section");
    
            // 📌 **Filtrar pilotos correctamente usando `teamId`**
            const teamDrivers = driversData.filter(driver => 
                driver.team.toLowerCase() === team.teamId.toLowerCase()
            );
    
            if (teamDrivers.length > 0) {
                // ✅ **Aplicamos Grid para organizar las tarjetas**
                driversSection.classList.add("grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "gap-4");

                teamDrivers.forEach(driver => {
                    const driverCard = document.createElement("div");
                    driverCard.classList.add("driver", "bg-gray-800", "text-center", "p-4", "rounded-lg", "shadow-md");

                    driverCard.innerHTML = `
                        <img src="${driver.url || "https://www.formula1.com/default_driver.jpg"}" alt="${driver.nombre}" class="w-20 h-20 object-cover rounded-full border-2 border-gray-300 mx-auto">
                        <p class="text-white font-semibold mt-2">${driver.nombre} ${driver.apellido}</p>
                        <p class="text-sm text-gray-400">🏎️ Número: ${driver.numero}</p>
                    `;

                    driversSection.appendChild(driverCard);
                });

            } else {
                driversSection.innerHTML = `<p class="text-gray-500 mt-4">❌ No hay pilotos registrados para este equipo.</p>`;
            }
    
            // 📌 **Mostrar autos con información detallada**
            const teamCars = carsData.find(carEntry => carEntry.equipo === team.nombre)?.autos || [];
            if (teamCars.length > 0) {
                carsSection.innerHTML = `<h4 class="text-lg font-bold mt-4 text-white">🏎️ Autos</h4>`;
                teamCars.forEach(car => {
                    const carBox = document.createElement("div");
                    carBox.classList.add("car-box", "p-4", "rounded-lg", "bg-gray-900", "shadow-md");
    
                    carBox.innerHTML = `
                        <img src="${car.imagen}" alt="${car.modelo}" class="w-full h-48 object-cover rounded-lg">
                        <h5 class="text-white font-bold">${car.modelo} - ${car.motor}</h5>
                        <p class="text-gray-400 text-sm">Velocidad Máx: ${car.velocidad_maxima_kmh} km/h</p>
                        <p class="text-gray-400 text-sm">Aceleración: 0-100 km/h en ${car.aceleracion_0_100}s</p>
                    `;
    
                    carsSection.appendChild(carBox);
                });
            } else {
                carsSection.innerHTML = `<p class="text-gray-500 mt-4">❌ No hay autos registrados para este equipo.</p>`;
            }
        });
    
        console.log(`✅ Tarjetas de equipos actualizadas con pilotos y autos correctamente filtrados.`);
    }
    

    animateButtons() {
        gsap.to(this.shadowRoot.querySelectorAll("a"), {
            opacity: 1,
            duration: 1.5,
            stagger: 0.2,
            ease: "power2.out"
        });
    }
}

// 🚀 **Registrar el Web Component**
customElements.define("team-card-component", TeamCardComponent);


