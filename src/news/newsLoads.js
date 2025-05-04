async function fetchNewsData(filter = "All News") {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/news");
        if (!response.ok) throw new Error("❌ Fallo en la API de noticias");

        const newsData = await response.json();
        if (!newsData || newsData.length === 0) throw new Error("❌ Datos vacíos o corruptos");

        const newsImages = {
            new1: "https://www.reuters.com/resizer/v2/PCM6OWX3UZPJ3DWEYE2SNH6RTA.jpg?auth=458ca5af8cdf3f21e95a8af0700398f40116cda8299541626bca085118a7a87a&width=960&quality=80",
            new2: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1DZBiD.img?w=768&h=403&m=6"
        };

        let filteredNews = newsData.filter(news => news.image_url || news.title);

        if (filter === "All News") {
            filteredNews = filteredNews.filter(news => 
                /fórmula 1|F1|gran premio|GP|escudería|piloto|circuito|Miami|Verstappen|Leclerc|Piastri/i.test(news.title)
            );
        } else if (filter === "News F1 Teams") {
            filteredNews = filteredNews.filter(news => 
                /Red Bull|Mercedes|Ferrari|McLaren|Aston Martin|Alpine|AlphaTauri|Haas|Williams|Sauber/i.test(news.title + news.description)
            );
        } else if (filter === "News F1 Circuits") {
            filteredNews = filteredNews.filter(news => 
                /Monza|Silverstone|Spa|Suzuka|Interlagos|Miami|Monaco|Abu Dhabi|Singapore|Austin|Imola|Hungaroring/i.test(news.title + news.description)
            );
        }

        // 🔄 Manejo de casos especiales
        filteredNews = filteredNews.map((news) => {
            if (news._id === "6814b4d32908b7fe0bda9fd2") {
                news.image_url = newsImages.new1;
            } else if (news._id === "6814b4d52908b7fe0bda9ffc") {
                news.image_url = newsImages.new2;
            } else {
                // 🔄 Asignar imágenes por defecto si falta `image_url`
                news.image_url = news.image_url || (Math.random() < 0.5 ? newsImages.new1 : newsImages.new2);
            }
            return news;
        });

        return filteredNews.slice(0, 8);
    } catch (error) {
        console.error(error.message);

        // 🚨 Si la API falla, crear noticias con imágenes por defecto
        return Array.from({ length: 8 }, (_, index) => ({
            title: `Noticia F1 #${index + 1}`,
            description: "Contenido no disponible debido a un error en la API.",
            image_url: index % 2 === 0 ? newsImages.new1 : newsImages.new2,
            link: "#"
        }));
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
    const newsLinks = document.querySelector("news-links");

    newsLinks.addEventListener("news-selected", async (event) => {
        const filterType = event.detail.newsType;
        console.log(`🔎 Aplicando filtro: ${filterType}`);

        const newsData = await fetchNewsData(filterType);
        if (newsData.length > 0) {
            replaceNewsCards(newsData);
        }
    });

    // 🔥 Cargar noticias iniciales (Todas)
    const initialNewsData = await fetchNewsData("All News");
    if (initialNewsData.length > 0) {
        replaceNewsCards(initialNewsData);
    }
});


export { fetchNewsData, replaceNewsCards };

