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
                            <img src="../assets/icons/icon2Formula1.svg" alt="Formula 1 Icon" class="w-8 h-8 ml-4">
                            <p class="text-lg font-semibold text-center w-full">Learn More...</p>
                        </a>
                        <div class="actions">
                            <button class="edit-btn" onclick="showUpdateDriverModal('${i}')">📝 Editar</button>
                            <button class="delete-btn" onclick="deleteDriver('${i}')">❌ Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            cards.push(card);
            container.appendChild(card);
        }

        this.shadowRoot.appendChild(container);

        // 📌 **Llamar a la API y actualizar las tarjetas**
        const data = await this.fetchFilteredData();
        this.replaceCardsForDrivers(cards, data);
    }

    async fetchFilteredData() {
        try {
            console.log(`🔄 Obteniendo datos actualizados desde la API...`);
            const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers");

            if (!response.ok) {
                throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de pilotos`);
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ Error al obtener datos de pilotos:`, error.message);
            return [];
        }
    }

    replaceCardsForDrivers(cards, data) {
        if (cards.length < 20) {
            console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
            return;
        }

        localStorage.setItem("activeFilter", "All Drivers");

        cards.forEach((card, index) => {
            if (index >= data.length) return;
            const item = data[index];

            card.querySelector("img").src = item.urlImagen || item.url || "https://www.formula1.com/default_image.jpg";
            card.querySelector("h3").textContent = `🏎️ ${item.nombre} ${item.apellido} - ${item.team}`;
            card.querySelector("p").textContent = `📆 Nacimiento: ${item.fechaNacimiento} | 🇬🇧 Nacionalidad: ${item.nacionalidad}`;
            card.querySelector("a").href = `https://www.formula1.com/en/drivers/${item.driverId}.html` || "#";
        });

        console.log(`✅ Tarjetas de pilotos actualizadas correctamente.`);
    }
    
    showCreateDriverModal() {
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add(
            "fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50"
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
                <div class="flex justify-between mt-4">
                    <button type="button" id="cancelButton" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">❌ Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar</button>
                </div>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    
        // 📌 **Cerrar el modal con `addEventListener`**
        document.getElementById("cancelButton").addEventListener("click", closeModalPilot);
        function closeModalPilot() {
            const modalOverlay = document.querySelector(".fixed.top-0.left-0.w-full.h-full.bg-black.bg-opacity-50");
            if (modalOverlay) modalOverlay.remove();
        }
    
        document.getElementById("driverForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const newDriver = {
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                team: document.getElementById("team").value,
                numero: document.getElementById("numero").value,
                nacionalidad: document.getElementById("nacionalidad").value,
                urlImagen: document.getElementById("urlImagen").value
            };
    
            try {
                const response = await fetch("https://projectformula1-production.up.railway.app/api/drivers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newDriver)
                });
    
                if (!response.ok) throw new Error("❌ Error al agregar piloto.");
                const createdDriver = await response.json();
                
                closeModalPilot();
                updateDriverList(createdDriver); // 🔄 Agregar el nuevo piloto a la UI
            } catch (error) {
                console.error(error.message);
            }
        });
    }
    async deleteDriver(driverId) {
        try {
            const response = await fetch(`https://projectformula1-production.up.railway.app/api/drivers/${driverId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("❌ No se pudo eliminar el piloto.");
            console.log(`✅ Piloto eliminado correctamente.`);
            this.connectedCallback();
        } catch (error) {
            console.error(error.message);
        }
    }
    
}

// 🚀 **Registrar el Web Component**
customElements.define("card-component", CardComponent);
