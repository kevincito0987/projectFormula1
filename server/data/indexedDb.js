export async function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("F1AppDB", 3); // 🔄 Incrementa la versión para forzar actualización

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const stores = ["adminSessions", "userSessions", "drivers", "teams", "circuits", "standings"]; // ⚡ Se agrega "standings"

            stores.forEach(store => {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store, { keyPath: "id" });
                    console.log(`✅ Almacén de objetos creado: ${store}`);
                }
            });
        };

        request.onsuccess = (event) => {
            console.log("✅ IndexedDB inicializado correctamente.");
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error("❌ Error al inicializar IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
}

// 📦 **Verificar existencia de almacén antes de transacción**
export async function checkObjectStoreExists(db, storeName) {
    if (!db.objectStoreNames.contains(storeName)) {
        console.error(`❌ Error: El almacén ${storeName} no existe.`);
        throw new Error(`Object store ${storeName} not found`);
    }
}

// 📦 **Guardar datos en IndexedDB (validando ID)**
export async function saveToIndexedDB(storeName, data) {
    const db = await initIndexedDB();
    await checkObjectStoreExists(db, storeName); // 🔎 Verifica que el almacén exista antes de transacción

    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    if (Array.isArray(data)) {
        data.forEach(item => {
            if (!item.id) {
                item.id = `admin-generated-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                console.warn(`⚠ Asignando ID genérico: ${item.id}`);
            }
            store.put(item);
        });
    } else {
        if (!data.id) {
            data.id = `admin-generated-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            console.warn(`⚠ Asignando ID genérico: ${data.id}`);
        }
        store.put(data);
    }

    console.log(`✅ Datos guardados en IndexedDB (${storeName}).`);
}

// 🔎 **Obtener datos desde IndexedDB usando cursores**
export async function getFromIndexedDB(storeName) {
    return new Promise(async (resolve, reject) => {
        const db = await initIndexedDB();
        await checkObjectStoreExists(db, storeName); // 🔎 Verifica almacén antes de transacción

        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const data = [];

        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                data.push(cursor.value);
                cursor.continue();
            } else {
                console.log(`🔎 Datos obtenidos de IndexedDB (${storeName}):`, data);
                resolve(data);
            }
        };

        request.onerror = () => reject(`❌ Error al obtener datos de ${storeName} desde IndexedDB.`);
    });
}

// ✏️ **Actualizar datos en IndexedDB**
export async function updateInIndexedDB(storeName, updatedItem) {
    if (!updatedItem.id) {
        console.error(`❌ Error: Intento de actualizar objeto sin ID en ${storeName}.`, updatedItem);
        return;
    }

    const db = await initIndexedDB();
    await checkObjectStoreExists(db, storeName); // 🔎 Verifica almacén antes de transacción

    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    store.put(updatedItem);
    console.log(`✅ Datos actualizados en IndexedDB (${storeName}).`);
}
// ❌ **Eliminar datos en IndexedDB con verificación de ID válido**
export async function deleteFromIndexedDB(storeName, itemId) {
    if (!itemId || typeof itemId !== "string" || itemId.trim() === "") {
        console.error(`❌ Error: ID inválido al intentar eliminar en ${storeName}.`, itemId);
        return;
    }

    const db = await initIndexedDB();
    await checkObjectStoreExists(db, storeName); // 🔎 Verifica existencia del almacén antes de eliminar

    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    store.delete(itemId);
    console.log(`✅ Datos eliminados correctamente en IndexedDB (${storeName}, ID: ${itemId}).`);
}



// 🔄 **Sincronizar IndexedDB con la API**
export async function syncIndexedDBToAPI(storeName, apiUrl) {
    const data = await getFromIndexedDB(storeName);

    if (!data || data.length === 0) {
        console.log(`🔎 No hay datos de ${storeName} para sincronizar.`);
        return;
    }

    console.log(`🚀 Enviando datos de ${storeName} a la API: ${apiUrl}`);

    for (const item of data) {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`❌ Error en la respuesta de la API (${response.status}).`);
            }
            return response.json();
        })
        .then(result => console.log(`✅ Datos de ${storeName} sincronizados con la API:`, result))
        .catch(error => console.error(`❌ Error al sincronizar datos de ${storeName}:`, error));
    }
}

// 🏎️ **Funciones específicas para sesiones**
export async function saveSessionToIndexedDB(sessionData, userType) {
    await saveToIndexedDB(userType === "admin" ? "adminSessions" : "userSessions", {
        sessionId: `${userType}-session-${Date.now()}`,
        userType,
        userData: sessionData,
        timestamp: new Date().toISOString()
    });

    console.log(`✅ Sesión de ${userType} guardada en IndexedDB.`);
}

export async function getSessionFromIndexedDB(userType) {
    const sessions = await getFromIndexedDB(userType === "admin" ? "adminSessions" : "userSessions");
    return sessions.length > 0 ? sessions[sessions.length - 1] : null;
}

export async function syncIndexedDBSessionsToMongo(userType) {
    await syncIndexedDBToAPI(userType === "admin" ? "adminSessions" : "userSessions",
        userType === "admin"
        ? "https://projectformula1-production.up.railway.app/api/sessions/admin"
        : "https://projectformula1-production.up.railway.app/api/sessions/user");
}
