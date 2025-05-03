document.querySelector("news-links").addEventListener("news-selected", (event) => {
    console.log("Seleccionaste:", event.detail.newsType); // 🔥 Muestra la categoría seleccionada
});
document.addEventListener("DOMContentLoaded", function () {
    const video = document.querySelector("video");
    
    video.volume = 0.5; // 🔊 Ajusta el volumen al 50%
});
