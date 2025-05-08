class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // 🚀 Inicializa Shadow DOM
    }

    async connectedCallback() {
        const filter = this.getAttribute("filter");

        if (filter !== "All Drivers") {
            console.error("❌ Este componente solo maneja pilotos.");
            return;
        }

        // 📌 **Incluir GSAP directamente**
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        this.shadowRoot.appendChild(script);

        // 📌 **Crear botón para agregar pilotos**
        const addButton = document.createElement("button");
        addButton.classList.add("add-driver-btn");
        addButton.innerHTML = "➕ Agregar Piloto";
        addButton.onclick = () => this.showCreateDriverModal();
        this.shadowRoot.appendChild(addButton);

        // 📌 **Crear 20 tarjetas vacías**
        const container = document.createElement("div");
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
        container.style.gap = "1rem";

        const cards = [];
        for (let i = 0; i < 20; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("data-id", i); // ✅ Asignar ID único para cada tarjeta

            card.innerHTML = `
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                <style>
                    .card {
                        padding: 1.5rem;
                        border-radius: 0.75rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s;
                        margin-top : 30px;
                    }
                    .card:hover {
                        transform: scale(1.05);
                        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
                        background: var(--color-3);
                    }
                    img {
                        width: 100%;
                        height: auto;
                        border-radius: 0.75rem;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0.5rem 1rem;
                        background-color: #1f2937;
                        border: 2px solid #4b5563;
                        border-radius: 0.75rem;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        text-decoration: none;
                        color: #fff;
                    }
                    a img {
                        margin-right: 0.5rem;
                        width: 4rem;
                    }
                    .button:hover {
                        background-color: var(--color-3);
                        transform: scale(1.1);
                        box-shadow: 0px 4px 10px rgba(255, 0, 0, 0.5);
                    }
                    .actions {
                        margin-top: 1rem;
                        display: flex;
                        justify-content: center;
                        gap: 8px;
                    }
                    .edit-btn, .delete-btn {
                        padding: 0.5rem 1rem;
                        border-radius: 0.75rem;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                    .edit-btn {
                        background-color: #2563eb;
                        color: white;
                    }
                    .edit-btn:hover {
                        background-color: #1e40af;
                    }
                    .delete-btn {
                        background-color: #dc2626;
                        color: white;
                    }
                    .delete-btn:hover {
                        background-color: #b91c1c;
                    }
                </style>
                <div class="card">
                    <img src="https://www.formula1.com/default_image.jpg" alt="Cargando...">
                    <div class="mt-4">
                        <h3 class="text-xl font-bold text-center">Cargando...</h3>
                        <p class="text-sm mt-2 text-center">...</p>
                        <a class="button" href="#" target="_blank">
                            <img src="../assets/icons/icon2Formula1.svg" alt="Formula 1 Icon">
                            <p class="text-lg font-semibold text-center w-full">Learn More...</p>
                        </a>
                        <div class="actions">
                            <button class="edit-btn">📝 Editar</button>
                            <button class="delete-btn">❌ Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            cards.push(card);
            container.appendChild(card);
        }

        this.shadowRoot.appendChild(container);

        const data = await this.fetchFilteredData();
        this.replaceCardsForDrivers(cards, data);

        this.shadowRoot.addEventListener("click", (event) => {
            const path = event.composedPath();
            const card = path.find(el => el.classList?.contains("card"));
            if (!card) return;

            const driverId = card.getAttribute("data-id");

            if (event.target.classList.contains("delete-btn")) {
                this.deleteDriver(driverId);
            }

            if (event.target.classList.contains("edit-btn")) {
                this.showEditDriverModal(driverId);
            }
        });
    }
    async fetchFilteredData() {
        try {
            console.log("🔄 Solicitando datos actualizados desde la API...");
            
            const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers");
    
            if (!response.ok) {
                throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de pilotos`);
            }
    
            const data = await response.json();
    
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("⚠️ La API devolvió una respuesta vacía o no válida.");
                return [];
            }
    
            console.log("✅ Datos obtenidos correctamente:", data);
            return data;
            
        } catch (error) {
            console.error(`❌ Error al obtener datos de pilotos:`, error.message);
            return [];
        }
    }
    showEditDriverModal = async (driverId) => {
        try {
            if (!driverId) {
                console.error("❌ ID del piloto no válido.");
                return;
            }
    
            const response = await fetch(`https://projectformula1-production.up.railway.app/api/drivers/${driverId}`);
            if (!response.ok) throw new Error("❌ No se pudo obtener la información.");
    
            const driver = await response.json();
    
            const modalOverlay = document.createElement("div");
            modalOverlay.id = "editDriverModal";
            modalOverlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50");
    
            const modalContent = document.createElement("div");
            modalContent.classList.add("bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96");
    
            modalContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-4 text-center">✏️ Editar Piloto</h2>
                <form id="editDriverForm">
                    <input type="text" id="editNombre" value="${driver.nombre}" class="w-full p-3 bg-gray-800 text-white">
                    <input type="text" id="editApellido" value="${driver.apellido}" class="w-full p-3 bg-gray-800 text-white">
                    <input type="text" id="editTeam" value="${driver.team}" class="w-full p-3 bg-gray-800 text-white">
                    <input type="number" id="editNumero" value="${driver.numero}" class="w-full p-3 bg-gray-800 text-white">
                    <input type="text" id="editNacionalidad" value="${driver.nacionalidad}" class="w-full p-3 bg-gray-800 text-white">
                    <input type="url" id="editUrlImagen" value="${driver.url}" class="w-full p-3 bg-gray-800 text-white">
                    <div class="flex justify-between mt-4">
                        <button type="button" id="cancelEditButton" class="px-4 py-2 bg-red-600 text-white">❌ Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white">💾 Guardar Cambios</button>
                    </div>
                </form>
            `;
    
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
    
            document.getElementById("editDriverForm").addEventListener("submit", async (event) => {
                event.preventDefault();
    
                const updatedDriver = {
                    nombre: document.getElementById("editNombre").value.trim(),
                    apellido: document.getElementById("editApellido").value.trim(),
                    team: document.getElementById("editTeam").value.trim(),
                    numero: document.getElementById("editNumero").value.trim(),
                    nacionalidad: document.getElementById("editNacionalidad").value.trim(),
                    url: document.getElementById("editUrlImagen").value.trim()
                };
    
                try {
                    const response = await fetch(`https://projectformula1-production.up.railway.app/api/drivers/${driverId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedDriver)
                    });
    
                    if (!response.ok) throw new Error("❌ Error al actualizar.");
    
                    const card = document.querySelector(`.card[data-id="${driverId}"]`);
                    if (card) {
                        card.querySelector("img").src = updatedDriver.url;
                        card.querySelector("h3").textContent = `🏎️ ${updatedDriver.nombre} ${updatedDriver.apellido} - ${updatedDriver.team}`;
                        card.querySelector("p").textContent = `📆 Número: ${updatedDriver.numero} | 🇬🇧 Nacionalidad: ${updatedDriver.nacionalidad}`;
                    }
    
                    console.log("✅ Piloto actualizado correctamente.");
                    document.getElementById("editDriverModal").remove();
                } catch (error) {
                    console.error(error.message);
                }
            });
    
            document.getElementById("cancelEditButton").addEventListener("click", () => {
                document.getElementById("editDriverModal").remove();
            });
    
        } catch (error) {
            console.error(error.message);
        }
    };
       

    deleteDriver = async (driverId) => {
        try {
            if (!driverId) {
                console.error("❌ ID del piloto no válido.");
                return;
            }
    
            const card = document.querySelector(`.card[data-id="${driverId}"]`);
            if (!card) {
                console.error("❌ No se pudo encontrar la tarjeta.");
                return;
            }
    
            const response = await fetch(`https://projectformula1-production.up.railway.app/api/drivers/${driverId}`, {
                method: "DELETE"
            });
    
            if (!response.ok) throw new Error("❌ No se pudo eliminar.");
    
            console.log(`✅ Piloto eliminado correctamente.`);
            card.remove(); // 🗑️ **Elimina la tarjeta de la UI**
    
        } catch (error) {
            console.error(error.message);
        }
    };
        
    
    replaceCardsForDrivers(cards, data) {
        if (!Array.isArray(cards) || !Array.isArray(data)) {
            console.error("❌ Error: Datos inválidos, no es un array.");
            return;
        }
    
        if (cards.length === 0 || data.length === 0) {
            console.warn("⚠️ No hay suficientes datos para actualizar las tarjetas.");
            return;
        }
    
        localStorage.setItem("activeFilter", "All Drivers");
    
        cards.forEach((card, index) => {
            if (index >= data.length) return;
            const item = data[index];
    
            // 📌 **Asignar el `_id` de la API correctamente SIN mostrarlo en la UI**
            card.setAttribute("data-id", item._id || `temp-${index}`);
    
            const imageUrl = item.url && item.url.trim() !== "" ? item.url : "https://www.formula1.com/default_image.jpg";
    
            const imgElement = card.querySelector("img");
            if (imgElement) imgElement.src = imageUrl;
    
            const titleElement = card.querySelector("h3");
            if (titleElement) {
                titleElement.textContent = `🏎️ ${item.nombre ?? "Desconocido"} ${item.apellido ?? ""} - ${item.team ?? "Sin equipo"}`;
            }
    
            const descriptionElement = card.querySelector("p");
            if (descriptionElement) {
                descriptionElement.textContent = `📆 Nacimiento: ${item.fechaNacimiento ?? "N/A"} | 🇬🇧 Nacionalidad: ${item.nacionalidad ?? "N/A"}`;
            }
    
            const linkElement = card.querySelector("a");
            if (linkElement) {
                linkElement.href = item._id ? `https://www.formula1.com/en/drivers/${item._id}.html` : "#";
            }
        });
    
        console.log("✅ Tarjetas de pilotos actualizadas correctamente.");
    }
      
    
    
    showCreateDriverModal() {
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "createDriverModal";
        modalOverlay.classList.add(
            "fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto"
        );
    
        const modalContent = document.createElement("div");
        modalContent.classList.add("bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm");
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">➕ Agregar Piloto</h2>
            <form id="driverForm" class="space-y-4">
                <input type="text" id="nombre" placeholder="Nombre" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="apellido" placeholder="Apellido" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="team" placeholder="Equipo" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="numero" placeholder="Número" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="nacionalidad" placeholder="Nacionalidad" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="urlImagen" placeholder="URL de imagen" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <div class="flex justify-between mt-4">
                    <button type="button" id="cancelButton" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">❌ Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar</button>
                </div>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    
        function closeModalPilot() {
            const modal = document.getElementById("createDriverModal");
            if (modal) modal.remove();
        }
    
        document.getElementById("driverForm").addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const newDriver = {
                nombre: document.getElementById("nombre")?.value.trim() || "Desconocido",
                apellido: document.getElementById("apellido")?.value.trim() || "",
                team: document.getElementById("team")?.value.trim() || "Sin equipo",
                numero: document.getElementById("numero")?.value.trim() || "N/A",
                nacionalidad: document.getElementById("nacionalidad")?.value.trim() || "N/A",
                url: document.getElementById("urlImagen")?.value.trim() || "https://www.formula1.com/default_image.jpg"
            };
    
            if (!newDriver.nombre || !newDriver.apellido || !newDriver.team) {
                console.error("❌ Faltan datos obligatorios del piloto.");
                return;
            }
    
            try {
                const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newDriver)
                });
    
                if (!response.ok) throw new Error("❌ Error al agregar piloto.");
    
                const createdDriver = await response.json();
                this.updateDriverList(createdDriver);
                closeModalPilot();
            } catch (error) {
                console.error(error.message);
            }
        });
    
        document.getElementById("cancelButton").addEventListener("click", closeModalPilot);
    }
    updateDriverList(driver) {
        const driverList = this.shadowRoot.querySelector("div");
        if (!driverList) {
            console.error("❌ No se encontró el contenedor de la lista de pilotos.");
            return;
        }
    
        const assignedId = driver._id ? driver._id : `temp-${Date.now()}`;
    
        const newCard = document.createElement("div");
        newCard.classList.add("p-4", "bg-gray-800", "text-white", "rounded-lg", "shadow-md", "mt-9", "card");
        newCard.setAttribute("data-id", assignedId);
    
        newCard.innerHTML = `
            <img src="${driver.url}" class="w-16 h-16 rounded-full object-cover mb-2">
            <h3 class="text-lg font-bold">🏎️ ${driver.nombre} ${driver.apellido} - ${driver.team}</h3>
            <p class="text-sm">📆 Número: ${driver.numero} | 🇬🇧 Nacionalidad: ${driver.nacionalidad}</p>
            <div class="flex gap-2 mt-2">
                <button class="bg-blue-500 text-white px-3 py-1 rounded-md edit-btn">✏️ Editar</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded-md delete-btn">❌ Eliminar</button>
            </div>
        `;
    
        // 📌 **Asignar eventos a los botones de la nueva tarjeta**
        newCard.querySelector(".edit-btn").addEventListener("click", () => {
            this.showEditDriverModal(assignedId);
        });
    
        newCard.querySelector(".delete-btn").addEventListener("click", () => {
            this.deleteDriver(assignedId);
        });
    
        driverList.prepend(newCard);
        console.log("✅ Piloto agregado correctamente con ID:", assignedId);
    }    
    
    
}

// 🚀 **Registrar el Web Component**
customElements.define("card-component", CardComponent);
