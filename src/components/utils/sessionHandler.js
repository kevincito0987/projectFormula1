import { saveSessionToIndexedDB, syncIndexedDBSessionsToMongo } from "../../../server/data/indexedDb.js";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".users a").forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();

            const userType = event.currentTarget.querySelector(".rol").textContent.includes("Admin") ? "admin" : "user";
            const sessionData = { username: "Kevin", role: userType };

            console.log(`🟢 Guardando sesión para: ${userType}`);

            await saveSessionToIndexedDB(sessionData, userType);
            await syncIndexedDBSessionsToMongo(userType);

            // Mensaje de confirmación
            alert(`✅ Se ha iniciado sesión como ${userType}`);

            // Redirección basada en el tipo de usuario
            if (userType === "admin") {
                activateAdminFeatures();
                window.location.href = "../../../views/homePageAdmin.html"; // Ajusta la ruta según tu estructura
            } else {
                window.location.href = "../../../views/homePageUser.html"; // Ajusta la ruta según tu estructura
            }
        });
    });
});

function activateAdminFeatures() {
    console.log("🔥 Modo Admin activado: Puedes acceder a opciones avanzadas.");
    document.body.classList.add("admin-mode");
}
