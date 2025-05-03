export async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("F1AppDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("adminSessions")) {
                db.createObjectStore("adminSessions", { keyPath: "sessionId" });
            }
            if (!db.objectStoreNames.contains("userSessions")) {
                db.createObjectStore("userSessions", { keyPath: "sessionId" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("❌ Error al inicializar IndexedDB.");
    });
}

export async function saveSessionToIndexedDB(sessionData, userType) {
    const db = await initIndexedDB();
    const transaction = db.transaction(userType === "admin" ? "adminSessions" : "userSessions", "readwrite");
    const store = transaction.objectStore(userType === "admin" ? "adminSessions" : "userSessions");

    const session = {
        sessionId: `${userType}-session-${Date.now()}`,
        userData: sessionData,
        timestamp: new Date()
    };

    store.add(session);
    console.log(`✅ Sesión de ${userType} guardada en IndexedDB:`, session);
}

export async function getAllSessionsFromIndexedDB(userType) {
    return new Promise(async (resolve, reject) => {
        const db = await initIndexedDB();
        const transaction = db.transaction(userType === "admin" ? "adminSessions" : "userSessions", "readonly");
        const store = transaction.objectStore(userType === "admin" ? "adminSessions" : "userSessions");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(`❌ Error al obtener sesiones de ${userType} desde IndexedDB.`);
    });
}

export async function syncIndexedDBToMongo(userType) {
    const sessions = await getAllSessionsFromIndexedDB(userType);

    if (sessions.length === 0) {
        console.log(`🔎 No hay sesiones de ${userType} para sincronizar.`);
        return;
    }

    const syncURL = userType === "admin"
        ? "https://projectformula1-production.up.railway.app/api/sessions/admin"
        : "https://projectformula1-production.up.railway.app/api/sessions/user";

    fetch(syncURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessions }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`❌ Error en la respuesta del servidor: ${response.status}`);
        }
        return response.json();
    })
    .then(result => console.log(`✅ Sesiones de ${userType} sincronizadas con MongoDB:`, result))
    .catch(error => console.error(`❌ Error al sincronizar sesiones de ${userType}:`, error));
}
