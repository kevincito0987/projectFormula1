import { fetchNewsData, replaceNewsCards } from "./news/newsLoads.js";
import "../src/components/user-config/userConfig.js"; // 🛠 Importar el Web Component

document.querySelector("news-links").addEventListener("news-selected", async (event) => {
    const filterType = event.detail.newsType;
    console.log(`🔎 Aplicando filtro: ${filterType}`);

    const newsData = await fetchNewsData(filterType);
    if (newsData.length > 0) {
        replaceNewsCards(newsData);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const profileIcon = document.getElementById("profile-icon");
    const homeIcon = document.getElementById("home-icon");
    const mainContainer = document.querySelector(".mainContent");
    const originalContent = mainContainer.cloneNode(true); // 🔄 Clona el contenido para evitar pérdida de estructura

    profileIcon.addEventListener("click", (event) => {
        event.preventDefault();
        mainContainer.innerHTML = "<user-config></user-config>";

        setTimeout(() => {
            const userConfig = document.querySelector("user-config");
            if (!userConfig) return;

            userConfig.addEventListener("nameChange", (event) => {
                console.log("Nuevo nombre cambiado a:", event.detail);
            });

            userConfig.addEventListener("logout", async () => {
                console.log("Usuario cerró sesión.");
                mainContainer.replaceWith(originalContent.cloneNode(true)); // Restauración completa de la vista

                setTimeout(async () => {
                    const filteredNews = await fetchNewsData("All News");
                    if (filteredNews.length > 0) {
                        replaceNewsCards(filteredNews);
                    }
                }, 100);
            });
        }, 50);
    });

    homeIcon.addEventListener("click", async (event) => {
        event.preventDefault();
        mainContainer.replaceWith(originalContent.cloneNode(true)); // Recuperar contenido inicial

        setTimeout(async () => {
            const filteredNews = await fetchNewsData("All News");
            if (filteredNews.length > 0) {
                replaceNewsCards(filteredNews);
            }
        }, 100);
    });

    // 🔥 Carga inicial de noticias
    const initialNewsData = await fetchNewsData("All News");
    if (initialNewsData.length > 0) {
        replaceNewsCards(initialNewsData);
    }
});
