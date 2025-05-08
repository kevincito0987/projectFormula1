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

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    this.shadowRoot.appendChild(script);

    const addButton = document.createElement("button");
    addButton.classList.add("add-driver-btn");
    addButton.innerHTML = "➕ Agregar Piloto";
    addButton.onclick = () => this.showCreateDriverModal();
    this.shadowRoot.appendChild(addButton);

    const container = document.createElement("div");
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "1rem";
    this.shadowRoot.appendChild(container);

    const cards = [];

    // ✅ **Crear 20 tarjetas vacías con IDs temporales**
    for (let i = 0; i < 20; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-id", `temp-${i}`); // 🔥 ID temporal hasta obtener datos reales

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
                        flex-direction: row;
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
                    a {
                        text-decoration: none;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        padding: 20px;
                    }
                    .btn-news {
                        margin-top: 10px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        gap: 30px;
                        padding: 20px;
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
                    </div>
                </div>
            `;
            cards.push(card);
            container.appendChild(card);
        }
        console.log("⚠️ Tarjetas vacías creadas. Esperando datos de la API...");

        // ✅ **Obtener datos de la API y reemplazar tarjetas con datos reales**
        const data = await this.fetchFilteredData();
        this.replaceCardsForDrivers(cards, data);

        // ✅ **Delegación de eventos dentro del `shadowRoot`**
        this.shadowRoot.addEventListener("click", (event) => {
            const card = event.target.closest(".card");
            if (!card) return;

            const pilotName = card.querySelector("h3")?.textContent.split(" - ")[0]?.replace("🏎️", "").trim();
            if (!pilotName) {
                console.error("❌ No se pudo obtener el nombre del piloto desde la tarjeta.");
                return;
            }

            if (event.target.classList.contains("edit-btn")) {
                this.showEditDriverModal(); // ✅ Ahora pasamos el **nombre del piloto**, no `driverId`
            }

            if (event.target.classList.contains("delete-btn")) {
                this.deleteDriver(pilotName); // ✅ Misma lógica para eliminación basada en nombre
            }
        });

    }
    showEditDriverModal() {
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "editDriverModal";
        modalOverlay.classList.add(
            "fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto"
        );
    
        const modalContent = document.createElement("div");
        modalContent.classList.add(
            "bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm"
        );
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">✏️ Editar Piloto</h2>
            <form id="editDriverForm" class="space-y-4">
                <input type="text" id="editNombre" placeholder="Nombre" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editApellido" placeholder="Apellido" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editTeam" placeholder="Equipo" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="editNumero" placeholder="Número" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editNacionalidad" placeholder="Nacionalidad" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="editUrlImagen" placeholder="URL de imagen" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <div class="flex justify-between mt-4 g-3">
                    <button type="button" id="cancelEditButton" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">❌ Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar</button>
                </div>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    
        function closeModalEditPilot() {
            const modal = document.getElementById("editDriverModal");
            if (modal) modal.remove();
        }
    
        document.getElementById("cancelEditButton").addEventListener("click", closeModalEditPilot);
    
        // ✅ Verificar métodos permitidos antes de hacer `PATCH`
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
                // ✅ **Verificar si la API responde con encabezados correctos**
                const optionsResponse = await fetch("https://projectformula1-production.up.railway.app/api/drivers", {
                    method: "OPTIONS",
                });
        
                const allowMethods = optionsResponse.headers.get("Access-Control-Allow-Methods") || "";
                console.log("✅ Métodos permitidos:", allowMethods);
        
                // ✅ **Si no hay encabezados válidos, asumir `PUT`**
                const methodToUse = allowMethods.includes("PATCH") ? "PATCH" : "PUT";
        
                const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers", {
                    method: methodToUse,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedDriver)
                });
        
                if (!response.ok) throw new Error(`❌ Error al actualizar piloto con ${methodToUse}.`);
        
                console.log(`✅ Piloto actualizado correctamente con ${methodToUse}:`, updatedDriver);
                closeModalEditPilot();
            } catch (error) {
                console.error("🚨 Error de CORS o solicitud inválida:", error.message);
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
    showCreateDriverModal() {
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "createDriverModal";
        modalOverlay.classList.add(
            "fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto"
        );
    
        const modalContent = document.createElement("div");
        modalContent.classList.add(
            "bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm"
        );
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">➕ Agregar Piloto</h2>
            <form id="driverForm" class="space-y-4">
                <input type="text" id="nombre" placeholder="Nombre" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="apellido" placeholder="Apellido" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="team" placeholder="Equipo" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="numero" placeholder="Número" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="nacionalidad" placeholder="Nacionalidad" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="urlImagen" placeholder="URL de imagen" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <div class="flex justify-between mt-4 g-3">
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
    
            const driverList = document.querySelector("card-component");
            if (!driverList) {
                console.error("❌ No se encontró el contenedor de la lista de pilotos.");
                return;
            }
    
            const newCard = document.createElement("div");
            newCard.classList.add("p-4", "bg-gray-800", "text-white", "rounded-lg", "shadow-md", "mt-9", "card");
    
            newCard.innerHTML = `
                <img src="${newDriver.url}" class="w-16 h-16 rounded-full object-cover mb-2">
                <h3 class="text-lg font-bold">🏎️ ${newDriver.nombre} ${newDriver.apellido} - ${newDriver.team}</h3>
                <p class="text-sm">📆 Número: ${newDriver.numero} | 🇬🇧 Nacionalidad: ${newDriver.nacionalidad}</p>
                <div class="flex g-20 mt-2 btn-news">
                    <a class="bg-blue-500 text-white px-3 py-1 rounded-md edit-btn ">✏️ Editar</a>
                    <a class="bg-red-500 text-white px-3 py-1 rounded-md delete-btn" onclick="deleteDriver('${newDriver.numero}')">❌ Eliminar</a>
                </div>
            `;
    
            driverList.shadowRoot.querySelector("div").prepend(newCard);
            console.log("✅ Piloto agregado correctamente.");
    
            try {
                const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newDriver)
                });
    
                if (!response.ok) throw new Error("❌ Error al agregar piloto.");
                closeModalPilot();
            } catch (error) {
                console.error(error.message);
            }
        });     
    
        document.getElementById("cancelButton").addEventListener("click", closeModalPilot);

    }
    
    replaceCardsForDrivers(cards, data) {
        if (!Array.isArray(cards) || !Array.isArray(data)) {
            console.error("❌ Datos inválidos.");
            return;
        }
    
        if (cards.length === 0 || data.length === 0) {
            console.warn("⚠️ No hay datos suficientes.");
            return;
        }
    
        cards.forEach((card, index) => {
            if (index >= data.length) return; // Asegura que haya datos suficientes
    
            const item = data[index];
    
            if (!item.driverId) {
                console.error(`🚨 Error: El piloto ${item.nombre} no tiene driverId.`);
                return;
            }
    
            // ✅ Asigna `driverId` correctamente dentro del `shadowRoot`
            const shadowCard = this.shadowRoot.querySelector(`.card[data-id="${card.getAttribute("data-id")}"]`);
            if (!shadowCard) {
                console.warn(`⚠️ No se encontró la tarjeta dentro del shadowRoot con ID: ${card.getAttribute("data-id")}`);
                return;
            }
    
            shadowCard.setAttribute("data-id", item.driverId);
    
            const imageUrl = item.url?.trim() !== "" ? item.url : "https://www.formula1.com/default_image.jpg";
            shadowCard.querySelector("img").src = imageUrl;
    
            shadowCard.querySelector("h3").textContent = `🏎️ ${item.nombre ?? "Desconocido"} ${item.apellido ?? ""} - ${item.team ?? "Sin equipo"}`;
            shadowCard.querySelector("p").textContent = `📆 Nacimiento: ${item.fechaNacimiento ?? "N/A"} | 🇬🇧 Nacionalidad: ${item.nacionalidad ?? "N/A"}`;
            shadowCard.querySelector("a").href = item.driverId ? `https://www.formula1.com/en/drivers/${item.driverId}.html` : "#";
        });
    
        console.log("✅ Tarjetas de pilotos actualizadas correctamente en el shadowRoot.");
    }
    
    
}

// 🚀 **Registrar el Web Component**
customElements.define("card-component", CardComponent);
