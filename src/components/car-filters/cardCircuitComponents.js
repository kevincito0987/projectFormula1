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

        // 📌 **Obtener datos y actualizar tarjetas**
        const data = await this.fetchFilteredData();
        this.replaceCardsForCircuits(cards, data);
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
