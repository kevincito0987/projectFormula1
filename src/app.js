import { saveSessionToIndexedDB, syncIndexedDBSessionsToMongo, getSessionFromIndexedDB } from "../server/data/indexedDb.js";

document.addEventListener("DOMContentLoaded", () => {
    const profileIcon = document.getElementById("profile-icon");
    const homeIcon = document.getElementById("home-icon");

    profileIcon.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(".mainContent").innerHTML = "<user-config>";
    });

    // 📌 Esperar que el componente esté en el DOM antes de ejecutar `loadUserConfigData`
    const observer = new MutationObserver((mutationsList, observer) => {
        const userConfigElement = document.querySelector("user-config");
        if (userConfigElement) {
            loadUserConfigData();
            observer.disconnect(); // 🛑 Detener la observación una vez cargado
        }
    });

    observer.observe(document.querySelector(".mainContent"), { childList: true });

    homeIcon.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "../views/homePageUser.html";
    });
});

async function loadUserConfigData() {
    const profileTitle = document.querySelector("h1");
    const usernameInput = document.querySelector("#username");
    const teamSelect = document.querySelector("#team");
    const saveButton = document.querySelector("#saveBtn");

    if (!profileTitle || !usernameInput || !teamSelect || !saveButton) {
        console.error("❌ Error: Los elementos aún no están disponibles.");
        return;
    }

    try {
        const sessionData = await getSessionFromIndexedDB();

        console.log("🟢 Datos obtenidos de IndexedDB:", sessionData); // 🔍 Debug en la consola

        if (sessionData) {
            profileTitle.textContent = `🚀 Configuración de Perfil - ${sessionData.username}`;
            usernameInput.value = sessionData.username;
            teamSelect.value = sessionData.team || "Red Bull";
        } else {
            console.warn("⚠ No se encontraron datos de sesión en IndexedDB.");
        }
    } catch (error) {
        console.error("❌ Error al recuperar sesión desde IndexedDB:", error);
    }

    saveButton.addEventListener("click", async () => {
        const username = usernameInput.value.trim();
        const selectedTeam = teamSelect.value;

        const userData = { username, team: selectedTeam };

        await saveSessionToIndexedDB(userData);
        await syncIndexedDBToMongo(userData);

        profileTitle.textContent = `🚀 Configuración de Perfil - ${username}`;
        alert(`✅ Datos guardados: ${username}, Escudería favorita: ${selectedTeam}`);
    });
}
