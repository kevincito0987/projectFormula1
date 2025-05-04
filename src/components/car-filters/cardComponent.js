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
                        background-color:var(--color-3);
                        transform: scale(1.1);
                        box-shadow: 0px 4px 10px rgba(255, 0, 0, 0.5);
                    }
                    .button img {
                        margin-right: 0.5rem;
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
            card.querySelector("h3").textContent = `🏎️ ${item.nombre} - ${item.team}`;
            card.querySelector("p").textContent = `📆 Nacimiento: ${item.fechaNacimiento} | 🇬🇧 Nacionalidad: ${item.nacionalidad}`;
            card.querySelector("a").href = `https://www.formula1.com/en/drivers/${item.driverId}.html` || "#";
        });

        console.log(`✅ Tarjetas de pilotos actualizadas correctamente.`);
    }
    animateButtons() {
        // 🔥 Animación de entrada para los botones
        gsap.to(this.shadowRoot.querySelectorAll(".button"), {
            opacity: 1,
            duration: 1.5,
            stagger: 0.2,
            ease: "power2.out"
        });
    }   
}

// 🚀 **Registrar el Web Component**
customElements.define("card-component", CardComponent);
