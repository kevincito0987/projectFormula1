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
        const addButton = document.createElement("button");
        addButton.classList.add("add-driver-btn");
        addButton.innerHTML = "➕ Agregar Equipo";
        addButton.onclick = () => this.showCreateTeamModal();
        this.shadowRoot.appendChild(addButton);

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
                        .edit-btn {
                        background-color: #2563eb;
                        color: white;
                        padding: 20px;
                    }
                    .edit-btn:hover {
                        background-color: #1e40af;
                    }
                    .delete-btn {
                        background-color: #dc2626;
                        color: white;
                        padding: 20px;
                    }
                    .delete-btn:hover {
                        background-color: #b91c1c;
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
        this.shadowRoot.addEventListener("click", (event) => {
            const card = event.target.closest(".card");
            if (!card) return;

            if (event.target.classList.contains("edit-btn")) {
                this.showEditTeamModal(card); // ✅ Ahora pasamos la tarjeta completa, no el nombre
            }

            if (event.target.classList.contains("delete-btn")) {
                this.deleteDriver(card); // ✅ Mismo enfoque para eliminar la tarjeta correctamente
            }
        });

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
    showEditTeamModal = (targetCard) => {
        if (!targetCard) {
            console.error("❌ No se encontró la tarjeta del equipo para editar.");
            return;
        }
    
        const currentNombre = targetCard.querySelector("h3")?.textContent.split(" - ")[0]?.replace("🏎️", "").trim();
        const currentNacionalidad = targetCard.querySelector("h3")?.textContent.split(" - ")[1]?.trim();
        const currentFundacion = targetCard.querySelector("p")?.textContent.split("|")[0]?.replace("📆 Fundado:", "").trim();
        const currentCiudad = targetCard.querySelector("p")?.textContent.split("|")[1]?.replace("📍 Sede:", "").trim();
        const currentUrl = targetCard.querySelector("a")?.href || "#";
        const currentImage = targetCard.querySelector("img")?.src || "https://www.formula1.com/default_team.jpg";
    
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "editTeamModal";
        modalOverlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto");
    
        const modalContent = document.createElement("div");
        modalContent.classList.add("bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm");
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">✏️ Editar Equipo</h2>
            <form id="editTeamForm" class="space-y-4">
                <input type="url" id="editTeamImage" value="${currentImage}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editTeamNombre" value="${currentNombre}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editTeamNacionalidad" value="${currentNacionalidad}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="editTeamFundacion" value="${currentFundacion}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editTeamCiudad" value="${currentCiudad}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="editTeamUrl" value="${currentUrl}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <h3 class="text-lg font-semibold mt-4">🚗 Autos</h3>
                <div id="editAutosContainer"></div>
                <div class="flex justify-between mt-4 g-3">
                    <button type="button" id="cancelEditTeamButton" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">❌ Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar cambios</button>
                </div>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    
        function closeModalEditTeam() {
            modalOverlay.remove();
        }
    
        document.getElementById("cancelEditTeamButton").addEventListener("click", closeModalEditTeam);
    
        document.getElementById("editTeamForm").addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const updatedTeam = {
                imagen: document.getElementById("editTeamImage").value.trim(),
                nombre: document.getElementById("editTeamNombre").value.trim(),
                nacionalidad: document.getElementById("editTeamNacionalidad").value.trim(),
                primeraAparicion: document.getElementById("editTeamFundacion").value.trim(),
                ciudad: document.getElementById("editTeamCiudad").value.trim(),
                url: document.getElementById("editTeamUrl").value.trim()
            };
    
            try {
                const response = await fetch(`https://projectformula1-production.up.railway.app/api/teams/${encodeURIComponent(updatedTeam.nombre)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(updatedTeam),
                    mode: "cors"
                });
    
                if (!response.ok) throw new Error("❌ Error al actualizar el equipo.");
                console.log("✅ Equipo actualizado en la API.");
            } catch (error) {
                console.error("🚨 Error:", error.message);
            }
    
            targetCard.querySelector("img").src = updatedTeam.imagen;
            targetCard.querySelector("h3").textContent = `🏎️ ${updatedTeam.nombre} - ${updatedTeam.nacionalidad}`;
            targetCard.querySelector("p").textContent = `📆 Fundado: ${updatedTeam.primeraAparicion} | 📍 Sede: ${updatedTeam.ciudad}`;
            targetCard.querySelector("a").href = updatedTeam.url;
    
            closeModalEditTeam();
        });
    };
    
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
                driversSection.innerHTML = "<p class='text-gray-500 mt-4'>🏎️ Pilotos:</p>";
                driversSection.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-4");

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
    showEditTeamModal = (targetCard) => {
        if (!targetCard) {
            console.error("❌ No se encontró la tarjeta del equipo para editar.");
            return;
        }
    
        const currentImage = targetCard.querySelector("img")?.src || "";
        const currentNombre = targetCard.querySelector("h3")?.textContent.split(" - ")[0]?.replace("🏎️", "").trim() || "";
        const currentNacionalidad = targetCard.querySelector("h3")?.textContent.split(" - ")[1]?.trim() || "";
        const currentFundacion = targetCard.querySelector("p")?.textContent.split("|")[0]?.replace("📆 Fundado:", "").trim() || "";
        const currentCiudad = targetCard.querySelector("p")?.textContent.split("|")[1]?.replace("📍 Sede:", "").trim() || "";
        const currentUrl = targetCard.querySelector("a")?.href || "#";
    
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "editTeamModal";
        modalOverlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto");
    
        const modalContent = document.createElement("div");
        modalContent.classList.add("bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm");
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">✏️ Editar Equipo</h2>
            <form id="editTeamForm" class="space-y-4">
                <input type="url" id="editTeamImage" value="${currentImage}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editTeamNombre" value="${currentNombre}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editTeamNacionalidad" value="${currentNacionalidad}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="editTeamFundacion" value="${currentFundacion}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editTeamCiudad" value="${currentCiudad}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="editTeamUrl" value="${currentUrl}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <h3 class="text-lg font-semibold mt-4">🚗 Autos</h3>
                <input type="number" id="numEditAutos" placeholder="Cantidad de autos a modificar" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <div id="editAutosContainer"></div>
                <div class="flex justify-between mt-4 g-3">
                    <button type="button" id="cancelEditTeamButton" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">❌ Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar cambios</button>
                </div>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    
        function closeModalEditTeam() {
            modalOverlay.remove();
        }
    
        document.getElementById("cancelEditTeamButton").addEventListener("click", closeModalEditTeam);
    
        document.getElementById("editTeamForm").addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const updatedTeam = {
                imagen: document.getElementById("editTeamImage").value.trim(),
                nombre: document.getElementById("editTeamNombre").value.trim(),
                nacionalidad: document.getElementById("editTeamNacionalidad").value.trim(),
                primeraAparicion: document.getElementById("editTeamFundacion").value.trim(),
                ciudad: document.getElementById("editTeamCiudad").value.trim(),
                url: document.getElementById("editTeamUrl").value.trim()
            };
    
            try {
                const response = await fetch(`https://projectformula1-production.up.railway.app/api/teams/${encodeURIComponent(updatedTeam.nombre)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(updatedTeam),
                    mode: "cors"
                });
    
                if (!response.ok) throw new Error("❌ Error al actualizar el equipo.");
                console.log("✅ Equipo actualizado en la API.");
            } catch (error) {
                console.error("🚨 Error:", error.message);
            }
    
            targetCard.querySelector("img").src = updatedTeam.imagen;
            targetCard.querySelector("h3").textContent = `🏎️ ${updatedTeam.nombre} - ${updatedTeam.nacionalidad}`;
            targetCard.querySelector("p").textContent = `📆 Fundado: ${updatedTeam.primeraAparicion} | 📍 Sede: ${updatedTeam.ciudad}`;
            targetCard.querySelector("a").href = updatedTeam.url;
    
            closeModalEditTeam();
        });
    };
    
    showCreateTeamModal = () => {
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "createTeamModal";
        modalOverlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto");
    
        const modalContent = document.createElement("div");
        modalContent.classList.add("bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm");
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">➕ Agregar Equipo</h2>
            <form id="teamForm" class="space-y-4">
                <input type="url" id="teamImage" placeholder="URL Imagen del equipo" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="teamNombre" placeholder="Nombre del equipo" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="teamNacionalidad" placeholder="Nacionalidad" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="teamFundacion" placeholder="Año de fundación" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="teamCiudad" placeholder="Ciudad sede" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="teamUrl" placeholder="URL del sitio web" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <h3 class="text-lg font-semibold mt-4">🏎️ Piloto del equipo</h3>
                <input type="text" id="pilotNombre" placeholder="Nombre del piloto" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="pilotNumero" placeholder="Número del piloto" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="pilotUrl" placeholder="URL imagen del piloto" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <h3 class="text-lg font-semibold mt-4">🚗 Autos</h3>
                <input type="number" id="numAutos" placeholder="Cantidad de autos" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <div id="autosContainer"></div>
                <div class="flex justify-between mt-4 g-3">
                    <button type="button" id="cancelTeamButton" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">❌ Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar</button>
                </div>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    
        document.getElementById("numAutos").addEventListener("change", function () {
            const autosContainer = document.getElementById("autosContainer");
            autosContainer.innerHTML = "";
            const cantidad = parseInt(this.value, 10);
    
            for (let i = 0; i < cantidad; i++) {
                const autoFields = document.createElement("div");
                autoFields.classList.add("mt-4", "p-3", "bg-gray-800", "rounded-lg", "border", "border-gray-700", "gap-20");
                autoFields.innerHTML = `
                    <h4 class="text-lg font-semibold">🚗 Auto ${i + 1}</h4>
                    <input type="text" placeholder="Nombre del auto" class="w-full p-3 bg-gray-700 rounded-lg text-white auto-modelo">
                    <input type="url" placeholder="URL imagen del auto" class="w-full p-3 bg-gray-700 rounded-lg text-white auto-url">
                    <input type="text" placeholder="Modelo del auto" class="w-full p-3 bg-gray-700 rounded-lg text-white auto-modelo">
                    <input type="number" placeholder="Velocidad máxima (km/h)" class="w-full p-3 bg-gray-700 rounded-lg text-white auto-velocidad">
                    <input type="number" placeholder="Aceleración 0-100 km/h (segundos)" class="w-full p-3 bg-gray-700 rounded-lg text-white auto-aceleracion">
                `;
                autosContainer.appendChild(autoFields);
            }
        });
    
        document.getElementById("teamForm").addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const autos = Array.from(document.querySelectorAll("#autosContainer div")).map(auto => ({
                imagen: auto.querySelector(".auto-url").value.trim(),
                modelo: auto.querySelector(".auto-modelo").value.trim(),
                velocidad_maxima_kmh: auto.querySelector(".auto-velocidad").value.trim(),
                aceleracion_0_100: auto.querySelector(".auto-aceleracion").value.trim()
            }));
    
            const newTeam = {
                imagen: document.getElementById("teamImage").value.trim(),
                nombre: document.getElementById("teamNombre").value.trim(),
                nacionalidad: document.getElementById("teamNacionalidad").value.trim(),
                primeraAparicion: document.getElementById("teamFundacion").value.trim(),
                ciudad: document.getElementById("teamCiudad").value.trim(),
                url: document.getElementById("teamUrl").value.trim(),
                pilotos: [{
                    nombre: document.getElementById("pilotNombre").value.trim(),
                    numero: document.getElementById("pilotNumero").value.trim(),
                    url: document.getElementById("pilotUrl").value.trim()
                }],
                autos: autos
            };
    
            try {
                const response = await fetch("https://projectformula1-production.up.railway.app/api/teams", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify(newTeam),
                    mode: "cors"
                });
    
                if (response.ok) {
                    console.log("✅ Equipo agregado en la API.");
                
                    // ✅ **Crear la tarjeta del equipo en el DOM**
                    const teamCard = document.createElement("div");
                    teamCard.classList.add("card", "bg-gray-800", "text-white", "p-4", "rounded-lg", "shadow-md");
                
                    teamCard.innerHTML = `
                        <img src="${newTeam.imagen}" class="w-full h-32 object-cover rounded-lg">
                        <h3 class="text-xl font-bold text-center mt-2">🏎️ ${newTeam.nombre} - ${newTeam.nacionalidad}</h3>
                        <p class="text-sm text-gray-400">📆 Fundado: ${newTeam.primeraAparicion} | 📍 Sede: ${newTeam.ciudad}</p>
                        <a class="button mt-3" href="${newTeam.url}" target="_blank">🌐 Sitio Web</a>
                        <h4 class="text-lg font-bold mt-4 text-white">🚗 Autos</h4>
                        <div class="cars-section"></div>
                    `;
                
                    const driversSection = document.createElement("div");
                    driversSection.classList.add("drivers-section", "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "gap-4");
                
                    newTeam.pilotos.forEach(pilot => {
                        const driverCard = document.createElement("div");
                        driverCard.classList.add("driver", "bg-gray-700", "text-center", "p-4", "rounded-lg", "shadow-md");
                
                        driverCard.innerHTML = `
                            <img src="${pilot.url}" class="w-16 h-16 rounded-full object-cover mb-2">
                            <p class="text-white font-semibold">${pilot.nombre}</p>
                            <p class="text-sm text-gray-400">🏎️ Número: ${pilot.numero}</p>
                            <a class="bg-blue-500 text-white px-3 py-1 rounded-md edit-btn ">✏️ Editar</a>
                            <a class="bg-red-500 text-white px-3 py-1 rounded-md delete-btn" onclick="deleteDriver()">❌ Eliminar</a>
                        `;
                
                        driversSection.appendChild(driverCard);
                    });
                
                    teamCard.appendChild(driversSection);
                
                    const carsSection = teamCard.querySelector(".cars-section");
                    newTeam.autos.forEach(car => {
                        const carBox = document.createElement("div");
                        carBox.classList.add("car-box", "bg-gray-900", "p-3", "rounded-lg", "shadow-md");
                
                        carBox.innerHTML = `
                            <img src="${car.imagen}" class="w-full h-24 object-cover rounded-lg mb-2">
                            <h5 class="text-white font-bold">${car.nombre}</h5>
                            <p class="text-gray-400 text-sm">Velocidad Máx: ${car.velocidad_maxima_kmh} km/h</p>
                            <p class="text-gray-400 text-sm">Aceleración: ${car.aceleracion_0_100}s</p>
                        `;
                
                        carsSection.appendChild(carBox);
                    });
                
                    // ✅ **Agregar la tarjeta al contenedor de equipos**
                    document.querySelector("team-card-component").shadowRoot.appendChild(teamCard);
                
                    console.log("✅ Tarjeta de equipo agregada correctamente.");
                }
            } catch (error) {
                console.error("🚨 Error:", error.message);
            }
    
            document.getElementById("createTeamModal").remove();
        });
    
        document.getElementById("cancelTeamButton").addEventListener("click", () => {
            document.getElementById("createTeamModal").remove();
        });
    };
    
    

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