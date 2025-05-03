document.getElementById("light-mode-toggle").addEventListener("click", function () {
    const root = document.documentElement;

    if (getComputedStyle(root).getPropertyValue("--header-gradient") === "linear-gradient(180deg, rgba(0,0,0,2) 5%, rgba(238, 0, 0, 0.1) 30%, rgba(238, 0, 0, 0.4) 60%, rgba(238, 0, 0, 1) 100%)") {
        root.style.setProperty("--header-gradient", "linear-gradient(180deg, rgba(0,0,0,2) 0%, var(--color-23) 30%, var(--color-21) 100%)"); // 🔙 Modo oscuro original
    } else {
        root.style.setProperty("--header-gradient", "linear-gradient(180deg, rgba(0,0,0,2) 5%, rgba(238, 0, 0, 0.1) 30%, rgba(238, 0, 0, 0.4) 60%, rgba(238, 0, 0, 1) 100%)"); // 🔥 Negro → Rojo progresivo
    }
    const body = document.body;
    body.classList.toggle("light-mode");
});
