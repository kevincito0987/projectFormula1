class NewsCards extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../styles.css">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
                ${Array.from({ length: 8 }, (_, index) => `
                    <div class="card bg-gray-800 p-6 rounded-lg shadow-lg transition hover:scale-105">
                        <img src="" alt="Card image ${index + 1}" class="w-full h-auto rounded-lg">
                        <div class="mt-4">
                            <h3 class="text-xl font-bold">📰 Noticia ${index + 1}</h3>
                            <p class="text-sm mt-2">Cargando contenido...</p>
                            <a href="#" class="flex flex-row items-center justify-center w-full p-4 text-white rounded-lg hover:bg-red-700 transition mt-4 button">
                                <img src="../assets/icons/icon2Formula1.svg" alt="" class="w-8 h-8 ml-4">
                                <p class="text-lg font-semibold text-center w-full">Learn More...</p>
                            </a>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }

    async updateNews(newsData) {
        const cards = this.shadowRoot.querySelectorAll(".card");

        newsData.slice(0, 8).forEach((news, index) => {
            cards[index].querySelector("img").src = news.image_url;
            cards[index].querySelector("h3").textContent = `📰 ${news.title}`;
            cards[index].querySelector("p").textContent = news.description;
            cards[index].querySelector("a").href = news.link;
        });
    }
}

customElements.define("news-cards", NewsCards);
