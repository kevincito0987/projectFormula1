import { saveSessionToIndexedDB, syncIndexedDBToMongo } from "../data/indexedDB.js";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".users a").forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();

            const userType = event.currentTarget.querySelector(".rol").textContent.includes("Admin") ? "admin" : "user";
            const sessionData = { username: "Kevin", role: userType };

            console.log(`🟢 Guardando sesión para: ${userType}`);

            await saveSessionToIndexedDB(sessionData, userType);
            await syncIndexedDBToMongo(userType);

            if (userType === "admin") {
                activateAdminFeatures();
            }
        });
    });
});

function activateAdminFeatures() {
    console.log("🔥 Modo Admin activado: Puedes acceder a opciones avanzadas.");
    document.body.classList.add("admin-mode");
}
