async function fetchNewsData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/news");
        const newsData = await response.json();

        // 🎯 Filtrar noticias que realmente sean de F1
        const filteredNews = newsData.filter(news => 
            /fórmula 1|F1|gran premio|GP|escudería|piloto|circuito/i.test(news.title)
        );

        return filteredNews; // 🔄 Solo devuelve noticias relevantes
    } catch (error) {
        console.error("❌ Error al obtener noticias:", error);
        return [];
    }
}

async function translateText(text, targetLang = "es") {
    try {
        const response = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: targetLang,
                format: "text"
            }),
        });

        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error("❌ Error al traducir:", error);
        return text;
    }
}

async function replaceDefaultCards(newsData) {
    const defaultCards = document.querySelectorAll(".grid .card");

    if (defaultCards.length >= 2) { 
        defaultCards[0].querySelector("img").src = newsData[0].image_url;
        defaultCards[0].querySelector("h3").textContent = `📰 ${await translateText(newsData[0].title)}`;
        defaultCards[0].querySelector("p").textContent = await translateText(newsData[0].description);
        defaultCards[0].querySelector("a").href = newsData[0].link;

        defaultCards[1].querySelector("img").src = newsData[1].image_url;
        defaultCards[1].querySelector("h3").textContent = `🧐 ${await translateText(newsData[1].title)}`;
        defaultCards[1].querySelector("p").textContent = await translateText(newsData[1].description);
        defaultCards[1].querySelector("a").href = newsData[1].link;
    }

    createNewsCards(newsData);
}

function createNewsCards(newsData) {
    const newsContainer = document.querySelector(".grid");

    newsData.slice(2, 8).forEach(news => { 
        const newsCard = document.createElement("div");
        newsCard.className = "card bg-gray-800 p-6 rounded-lg shadow-lg transition hover:scale-105";

        newsCard.innerHTML = `
            <img src="${news.image_url}" alt="News image" class="w-full h-auto rounded-lg">
            <div class="mt-4">
                <h3 class="text-xl font-bold">📰 ${news.title}</h3>
                <p class="text-sm mt-2">${news.description}</p>
                <a href="${news.link}" class="flex flex-row items-center justify-center w-full p-4 text-white rounded-lg hover:bg-red-700 transition mt-4 button">
                    <img src="../assets/icons/icon2Formula1.svg" alt="" class="w-8 h-8 ml-4">
                    <p class="text-lg font-semibold text-center w-full">Learn More...</p>
                </a>
            </div>
        `;

        newsContainer.appendChild(newsCard);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const newsData = await fetchNewsData();
    if (newsData.length > 0) {
        replaceDefaultCards(newsData);
    }
});
