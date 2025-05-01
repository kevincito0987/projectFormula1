class NewsLinks extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // 🔹 Activa el Shadow DOM

        // 🏎️ Plantilla HTML con Tailwind
        this.shadowRoot.innerHTML = `
            <style>
                @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
            </style>
            <div class="flex flex-wrap justify-center gap-6">
                <a href="#" class="flex flex-col items-center p-4 hover:scale-110 transition rounded-[30px]" data-name="All News">
                    <img src="../assets/icons/newsFormula1Icon.svg" alt="All News" class="w-16 h-16">
                    <p class="mt-2 text-lg font-bold">All News</p>
                </a>
                <a href="#" class="flex flex-col items-center p-4 hover:scale-110 transition rounded-[30px]" data-name="News F1 Teams">
                    <img src="../assets/icons/newsTeamFormula1Icon.svg" alt="News F1 Teams" class="w-16 h-16">
                    <p class="mt-2 text-lg font-bold">News F1 Teams</p>
                </a>
                <a href="#" class="flex flex-col items-center p-4 hover:scale-110 transition rounded-[30px]" data-name="News F1 Circuits">
                    <img src="../assets/icons/newsCircuitsFormula1Icon.svg" alt="News F1 Circuits" class="w-16 h-16">
                    <p class="mt-2 text-lg font-bold">News F1 Circuits</p>
                </a>
            </div>
        `;

        // 🏎️ Agregar evento para capturar clics en los enlaces
        this.shadowRoot.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const newsType = event.currentTarget.dataset.name;
                
                // 🔥 Despacha un evento personalizado
                this.dispatchEvent(new CustomEvent("news-selected", {
                    detail: { newsType },
                    bubbles: true, // Permite que el evento salga del Shadow DOM
                    composed: true // Hace que el evento sea accesible fuera del Shadow DOM
                }));
            });
        });
    }
}

// 🔥 Registrar el componente
customElements.define("news-links", NewsLinks);
