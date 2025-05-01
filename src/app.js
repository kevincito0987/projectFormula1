document.querySelector("news-links").addEventListener("news-selected", (event) => {
    console.log("Seleccionaste:", event.detail.newsType); // 🔥 Muestra la categoría seleccionada
});

async function getLatestF1News() {
    const url = "https://newsdata.io/api/1/news?apikey=pub_8360532528164487c638046bd83af7a3690b1&q=formula%201";
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        
        const data = await response.json();
        const latestNews = data.results.slice(0, 10); // 📌 Extraer solo las primeras 10 noticias
        
        console.log("Últimas noticias de F1:", latestNews); // 🔥 Muestra las noticias en la consola
        return latestNews;
    } catch (error) {
        console.error("Error obteniendo noticias:", error);
        return [];
    }
}

getLatestF1News()
