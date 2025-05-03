async function fetchNewsData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/news");
        const newsData = await response.json();

        // 🎯 Filtrar solo noticias de F1 con imagen
        let filteredNews = newsData.filter(news => 
            news.image_url && 
            /fórmula 1|F1|gran premio|GP|escudería|piloto|circuito|Miami|Verstappen|Leclerc|Piastri/i.test(news.title)
        );

        // 🔄 Si hay menos de 8 noticias filtradas, agregar más hasta completar el mínimo
        if (filteredNews.length < 8) {
            const additionalNews = newsData.filter(news => news.image_url).slice(0, 8 - filteredNews.length);
            filteredNews = [...filteredNews, ...additionalNews];
        }

        return filteredNews;
    } catch (error) {
        console.error("❌ Error al obtener noticias:", error);
        return [];
    }
}

async function replaceNewsCards(newsData) {
    const cards = document.querySelectorAll(".grid .card");

    if (cards.length < 8) {
        console.error("❌ Error: No hay suficientes tarjetas en el HTML.");
        return;
    }

    newsData.slice(0, 8).forEach((news, index) => {
        cards[index].querySelector("img").src = news.image_url;
        cards[index].querySelector("h3").textContent = `📰 ${news.title}`;
        cards[index].querySelector("p").textContent = news.description;
        cards[index].querySelector("a").href = news.link;
    });

    console.log("✅ Noticias reemplazadas correctamente en las tarjetas.");
}

document.addEventListener("DOMContentLoaded", async () => {
    const newsData = await fetchNewsData();
    if (newsData.length >= 8) {
        replaceNewsCards(newsData); // 🔥 Reemplaza información en las tarjetas existentes
    }
});
