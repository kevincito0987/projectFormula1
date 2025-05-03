    document.getElementById("light-mode-toggle").addEventListener("click", function () {
        const root = document.documentElement;

        if (getComputedStyle(root).getPropertyValue("--header-gradient") === "linear-gradient(180deg, rgba(0,0,0,2) 5%, rgba(238, 0, 0, 0.1) 30%, rgba(238, 0, 0, 0.4) 60%, rgba(238, 0, 0, 1) 100%)") {
            root.style.setProperty("--header-gradient", "linear-gradient(180deg, rgba(0,0,0,2) 0%, var(--color-23) 30%, var(--color-21) 100%)"); // 🔙 Modo oscuro original
            root.style.setProperty("--footer-boxshadow", "0px 0px 25px 40px var(--color-8)"); // 🔙 Sombra original
            root.style.setProperty("--light-mode-icon", "url(../assets/icons/lightModeIcon.svg)"); // 🌞 Ícono de modo claro
        } else {
            root.style.setProperty("--header-gradient", "linear-gradient(180deg, rgba(0,0,0,2) 5%, rgba(238, 0, 0, 0.1) 30%, rgba(238, 0, 0, 0.4) 60%, rgba(238, 0, 0, 1) 100%)"); // 🔥 Negro → Rojo progresivo
            root.style.setProperty("--footer-boxshadow", "0px 0px 25px 40px var(--color-21)"); // 🔥 Sombra roja intensa
            root.style.setProperty("--light-mode-icon", "url(../assets/icons/darkModeIcon.svg)"); // 🌞 Ícono de modo claro
        }

        const body = document.body;
        body.classList.toggle("light-mode");
        
    });
