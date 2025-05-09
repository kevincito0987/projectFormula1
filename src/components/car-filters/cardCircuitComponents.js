class CircuitCardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // 🚀 Inicializa Shadow DOM
    }

    async connectedCallback() {
        const filter = this.getAttribute("filter");

        if (filter !== "F1 Circuits") {
            console.error("❌ Este componente solo maneja circuitos.");
            return;
        }

        // 📌 **Crear el contenedor**
        const container = document.createElement("div");
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
        container.style.gap = "1rem";
        // const addButton = document.createElement("button");
        // addButton.classList.add("add-driver-btn");
        // addButton.innerHTML = "➕ Agregar Circuito";
        // addButton.onclick = () => this.showCreateCircuitModal();
        // this.shadowRoot.appendChild(addButton);

        const cards = [];
        for (let i = 0; i < 12; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <style>
                    .card {
                        padding: 1.5rem;
                        border-radius: 0.75rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                        opacity: 0;
                        transform: translateY(20px);
                        transition: transform 0.2s;
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
                    .button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0.75rem 1.5rem;
                        color: var(--color-1);
                        border-radius: 0.75rem;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        text-decoration: none;
                        opacity: 0;
                    }
                    .button:hover {
                        transform: scale(1.1);
                        box-shadow: 0px 4px 10px rgba(255, 0, 0, 0.5);
                        background-color: var(--color-3);
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
                        margin-bottom: 20px;
                        border-radius: 20px;
                    }
                    .edit-btn:hover {
                        background-color: #1e40af;
                    }
                    .delete-btn {
                        background-color: #dc2626;
                        color: white;
                        padding: 20px;
                        margin-bottom: 20px;
                        border-radius: 20px;
                    }
                    .delete-btn:hover {
                        background-color: #b91c1c;
                    }
                </style>
                <div class="card">
                    <img src="https://www.formula1.com/default_circuit.jpg" alt="Cargando...">
                    <div class="mt-4">
                        <h3 class="text-xl font-bold text-center">Cargando...</h3>
                        <p class="text-sm mt-2 text-center">...</p>
                        <a class="button" href="#" target="_blank">
                            <img src="../assets/icons/icon2Formula1.svg" alt="Formula 1 Icon" class="w-8 h-8 ml-4">
                            <p class="text-lg font-semibold text-center w-full">Learn More...</p>
                        </a>
                    </div>
                </div>
            `;
            cards.push(card);
            container.appendChild(card);
        }

        this.shadowRoot.appendChild(container);

        // 📌 **Esperar a que GSAP se cargue antes de animar**
        await this.loadGSAP();
        this.animateElements();

       // ✅ **Obtener datos de la API y reemplazar tarjetas con datos reales**
       const data = await this.fetchFilteredData();
       this.replaceCardsForCircuits(cards, data);

       // ✅ **Delegación de eventos dentro del `shadowRoot`**
       this.shadowRoot.addEventListener("click", (event) => {
           const card = event.target.closest(".card");
           if (!card) return;

           if (event.target.classList.contains("edit-btn")) {
               this.showEditDriverModal(card); // ✅ Ahora pasamos la tarjeta completa, no el nombre
           }

           if (event.target.classList.contains("delete-btn")) {
               this.deleteDriver(card); // ✅ Mismo enfoque para eliminar la tarjeta correctamente
           }
       });
    }

    async loadGSAP() {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
            script.onload = resolve;
            this.shadowRoot.appendChild(script);
        });
    }

    async fetchFilteredData() {
        try {
            console.log(`🔄 Obteniendo datos actualizados desde la API...`);
            const response = await fetch("https://projectformula1-production.up.railway.app/api/circuits");

            if (!response.ok) {
                throw new Error(`❌ Error ${response.status}: No se pudo obtener la data de circuitos`);
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ Error al obtener datos de circuitos:`, error.message);
            return [];
        }
    }

    replaceCardsForCircuits(cards, data) {
        if (cards.length < 12) {
            console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
            return;
        }

        localStorage.setItem("activeFilter", "F1 Circuits");

        cards.forEach((card, index) => {
            if (index >= data.length) return;
            const item = data[index];

            card.querySelector("img").src = item.urlImagen || "https://www.formula1.com/default_circuit.jpg";
            card.querySelector("h3").textContent = `📍 ${item.nombre} - ${item.pais}`;
            card.querySelector("p").textContent = `Ciudad: ${item.ciudad} | 🏁 Longitud: ${item.longitud}m`;
            card.querySelector("a").href = item.url || "#";
        });

        console.log(`✅ Tarjetas de circuitos actualizadas correctamente.`);
    }
    showCreateCircuitModal = () => {
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "createCircuitModal";
        modalOverlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto");
    
        const modalContent = document.createElement("div");
        modalContent.classList.add("bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm");
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">➕ Agregar Circuito</h2>
            <form id="circuitForm" class="space-y-4">
                <input type="text" id="circuitNombre" placeholder="Nombre del circuito" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="circuitPais" placeholder="País" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="circuitCiudad" placeholder="Ciudad" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="circuitLongitud" placeholder="Longitud (metros)" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="circuitImagen" placeholder="URL Imagen del circuito" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="circuitUrl" placeholder="URL del circuito" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <div class="flex justify-between mt-4 g-3">
                    <button type="button" id="cancelCircuitButton" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">❌ Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar</button>
                </div>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    
        document.getElementById("circuitForm").addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const newCircuit = {
                nombre: document.getElementById("circuitNombre").value.trim(),
                pais: document.getElementById("circuitPais").value.trim(),
                ciudad: document.getElementById("circuitCiudad").value.trim(),
                longitud: document.getElementById("circuitLongitud").value.trim(),
                urlImagen: document.getElementById("circuitImagen").value.trim(),
                url: document.getElementById("circuitUrl").value.trim()
            };
    
            if (!newCircuit.nombre || !newCircuit.pais || !newCircuit.longitud) {
                console.error("❌ Faltan datos obligatorios del circuito.");
                return;
            }
    
            const circuitList = document.querySelector("circuit-card-component");
            if (!circuitList) {
                console.error("❌ No se encontró el contenedor de la lista de circuitos.");
                return;
            }
    
            const newCard = document.createElement("div");
            newCard.classList.add("p-4", "bg-gray-800", "text-white", "rounded-lg", "shadow-md", "mt-9", "card");
    
            newCard.innerHTML = `
                <img src="${newCircuit.urlImagen}" class="w-16 h-16 rounded-full object-cover mb-2">
                <h3 class="text-lg font-bold">📍 ${newCircuit.nombre} - ${newCircuit.pais}</h3>
                <p class="text-sm">📍 Ciudad: ${newCircuit.ciudad} | 🏁 Longitud: ${newCircuit.longitud}m</p>
                <div class="flex g-20 mt-2 btn-news">
                    <a class="bg-blue-500 text-white px-3 py-1 rounded-md edit-btn">✏️ Editar</a>
                    <a class="bg-red-500 text-white px-3 py-1 rounded-md delete-btn" onclick="deleteCircuit(this)">❌ Eliminar</a>
                </div>
            `;
    
            circuitList.shadowRoot.querySelector("div").prepend(newCard);
            console.log("✅ Circuito agregado correctamente.");
    
            try {
                const response = await fetch("https://projectformula1-production.up.railway.app/api/circuits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCircuit)
                });
    
                if (!response.ok) throw new Error("❌ Error al agregar el circuito.");
                console.log("✅ Circuito agregado correctamente en la API.");
            } catch (error) {
                console.error(error.message);
            }
    
            document.getElementById("createCircuitModal").remove();
        });
    
        document.getElementById("cancelCircuitButton").addEventListener("click", () => {
            document.getElementById("createCircuitModal").remove();
        });
    };
    
    showEditCircuitModal = (targetCard) => {
        if (!targetCard) {
            console.error("❌ No se encontró la tarjeta del circuito para editar.");
            return;
        }
    
        const currentNombre = targetCard.querySelector("h3")?.textContent.split(" - ")[0]?.replace("📍", "").trim();
        const currentPais = targetCard.querySelector("h3")?.textContent.split(" - ")[1]?.trim();
        const currentCiudad = targetCard.querySelector("p")?.textContent.split("|")[0]?.replace("Ciudad:", "").trim();
        const currentLongitud = targetCard.querySelector("p")?.textContent.split("|")[1]?.replace("🏁 Longitud:", "").trim();
        const currentImagen = targetCard.querySelector("img")?.src || "";
        const currentUrl = targetCard.querySelector("a")?.href || "#";
    
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "editCircuitModal";
        modalOverlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "overflow-y-auto");
    
        const modalContent = document.createElement("div");
        modalContent.classList.add("bg-gray-900", "text-white", "p-6", "rounded-xl", "shadow-lg", "w-96", "max-w-sm");
    
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-center">✏️ Editar Circuito</h2>
            <form id="editCircuitForm" class="space-y-4">
                <input type="text" id="editCircuitNombre" value="${currentNombre}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editCircuitPais" value="${currentPais}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="text" id="editCircuitCiudad" value="${currentCiudad}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="number" id="editCircuitLongitud" value="${currentLongitud}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="editCircuitImagen" value="${currentImagen}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <input type="url" id="editCircuitUrl" value="${currentUrl}" class="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white">
                <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white">✅ Guardar cambios</button>
            </form>
        `;
    
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    };
    deleteCircuit = (targetCard) => {
        if (!targetCard) {
            console.error("❌ No se encontró la tarjeta del circuito para eliminar.");
            return;
        }
    
        targetCard.remove();
        console.log("✅ Circuito eliminado correctamente.");
    };
    
    

    animateElements() {
        gsap.to(this.shadowRoot.querySelectorAll(".card"), {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power2.out"
        });

        gsap.to(this.shadowRoot.querySelectorAll(".button"), {
            opacity: 1,
            duration: 1.5,
            stagger: 0.2,
            ease: "power2.out"
        });
    }
}

// 🚀 **Registrar el Web Component**
customElements.define("circuit-card-component", CircuitCardComponent);
