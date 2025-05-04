document.querySelector("news-links").addEventListener("news-selected", (event) => {
    console.log("Seleccionaste:", event.detail.newsType); // 🔥 Muestra la categoría seleccionada
});

document.addEventListener("DOMContentLoaded", () => {
    const profileIcon = document.getElementById("profile-icon");
    const homeIcon = document.getElementById("home-icon");
    const mainContainer = document.querySelector("main");
    const originalContent = mainContainer.innerHTML;

    profileIcon.addEventListener("click", (event) => {
        event.preventDefault();
        mainContainer.innerHTML = "<user-config></user-config>";
        
        const userConfig = document.querySelector("user-config");
        userConfig.addEventListener("nameChange", (event) => {
            console.log("Nuevo nombre cambiado a:", event.detail);
        });

        userConfig.addEventListener("logout", () => {
            document.body.classList.add("fade-slide");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 700);
        });
    });

    homeIcon.addEventListener("click", (event) => {
        event.preventDefault();
        mainContainer.innerHTML = originalContent;
    });
});
