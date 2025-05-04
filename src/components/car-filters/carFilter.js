class carsLinks extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // 🔹 Activa el Shadow DOM

        // 🏎️ Plantilla HTML con Tailwind
        this.shadowRoot.innerHTML = `
            <style>
                @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
                a:hover {
                    transform: scale(1.05);
                    box-shadow: 0px 4px 10px var(--color-5);
                    transition: all 0.4s ease-in-out;
                    background: var(--color-8);
                    border-radius: 30px;
                }
                .filters {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
            </style>
            <div class="flex flex-wrap justify-center gap-6 filters">
                <a href="#" class="flex flex-col items-center p-4 hover:scale-110 transition rounded-[30px]" data-name="All Drivers">
                    <img src="../assets/icons/newsFormula1Icon.svg" alt="All Drivers" class="w-16 h-16">
                    <p class="mt-2 text-lg font-bold">All Drivers</p>
                </a>
                <a href="#" class="flex flex-col items-center p-4 hover:scale-110 transition rounded-[30px]" data-name="F1 Teams">
                    <img src="../assets/icons/newsTeamFormula1Icon.svg" alt="F1 Teams" class="w-16 h-16">
                    <p class="mt-2 text-lg font-bold">F1 Teams</p>
                </a>
                <a href="#" class="flex flex-col items-center p-4 hover:scale-110 transition rounded-[30px]" data-name="F1 Circuits">
                    <img src="../assets/icons/newsCircuitsFormula1Icon.svg" alt="F1 Circuits" class="w-16 h-16">
                    <p class="mt-2 text-lg font-bold">F1 Circuits</p>
                </a>
                <a href="#" class="flex flex-col items-center p-4 hover:scale-110 transition rounded-[30px]" data-name="F1 Standings">
                    <img src="../assets/icons/raceIcon.svg" alt="F1 Standings" class="w-16 h-16">
                    <p class="mt-2 text-lg font-bold">F1 Standings</p>
                </a>
            </div>
        `;

        // 🏎️ Aplicar animaciones de entrada con GSAP
        gsap.fromTo(this.shadowRoot.querySelectorAll("a"), 
            { opacity: 0, y: 50 },  // 📌 Estado inicial: oculto y desplazado hacia abajo
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" } // 📌 Animación escalonada hacia arriba
        );

        // 🏎️ Aplicar animación con Anime.js en hover
        this.shadowRoot.querySelectorAll("a").forEach(link => {
            link.addEventListener("mouseenter", () => {
                anime({
                    targets: link,
                    scale: [1, 1.15], // 🔥 Expansión suave en hover
                    duration: 500,
                    easing: "easeInOutQuad",
                });
            });

            link.addEventListener("mouseleave", () => {
                anime({
                    targets: link,
                    scale: [1.15, 1], // 🔥 Regresa a su tamaño original
                    duration: 500,
                    easing: "easeInOutQuad",
                });
            });

            // 🔥 Despacha un evento personalizado al hacer clic
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const newsType = event.currentTarget.dataset.name;
                this.dispatchEvent(new CustomEvent("news-selected", {
                    detail: { newsType },
                    bubbles: true,
                    composed: true 
                }));
            });
        });
    }
}

// 🔥 Registrar el componente
customElements.define("cars-links", carsLinks);
