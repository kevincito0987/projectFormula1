document.querySelector("news-links").addEventListener("news-selected", (event) => {
    console.log("Seleccionaste:", event.detail.newsType); // 🔥 Muestra la categoría seleccionada
});
