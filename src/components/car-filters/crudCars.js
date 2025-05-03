const API_URL = "https://projectformula1-production.up.railway.app/api/drivers";

// 🏎️ Función para obtener todos los pilotos
export async function fetchDrivers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`❌ Error ${response.status} al obtener los pilotos.`);
        return await response.json();
    } catch (error) {
        console.error("❌ Error al obtener los pilotos:", error.message);
        return [];
    }
}

// 🏎️ Función para agregar un nuevo piloto
export async function addDriver(driverData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(driverData)
        });

        if (!response.ok) throw new Error(`❌ Error ${response.status} al agregar piloto.`);
        console.log("✅ Piloto agregado correctamente.");
        await refreshDrivers();
    } catch (error) {
        console.error("❌ Error al agregar piloto:", error.message);
    }
}

// ✏️ Función para actualizar datos de un piloto
export async function updateDriver(driverId, driverData) {
    try {
        const response = await fetch(`${API_URL}/${driverId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(driverData)
        });

        if (!response.ok) throw new Error(`❌ Error ${response.status} al actualizar piloto.`);
        console.log("✅ Piloto actualizado correctamente.");
        await refreshDrivers();
    } catch (error) {
        console.error("❌ Error al actualizar piloto:", error.message);
    }
}

// ❌ Función para eliminar un piloto
export async function deleteDriver(driverId) {
    try {
        const response = await fetch(`${API_URL}/${driverId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error(`❌ Error ${response.status} al eliminar piloto.`);
        console.log("✅ Piloto eliminado correctamente.");
        await refreshDrivers();
    } catch (error) {
        console.error("❌ Error al eliminar piloto:", error.message);
    }
}

// 🏎️ Función para renderizar los pilotos en la interfaz
export async function renderDrivers() {
    const driversContainer = document.getElementById("driversContainer");
    driversContainer.innerHTML = ""; 

    const drivers = await fetchDrivers();

    drivers.forEach(driver => {
        const driverCard = document.createElement("div");
        driverCard.classList.add("bg-gray-800", "p-6", "rounded-xl", "shadow-lg", "w-96", "text-white", "mb-6");

        driverCard.innerHTML = `
            <img src="${driver.url}" alt="${driver.nombre}" class="w-full h-48 object-cover rounded-lg">
            <h3 class="text-xl font-bold mt-4">${driver.nombre}</h3>
            <p class="text-gray-400">🏎️ Equipo: ${driver.team} | Número: ${driver.numero}</p>
            <div class="flex justify-center gap-3 mt-4">
                <button onclick="showUpdateDriverModal('${driver.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">📝 Editar</button>
                <button onclick="deleteDriver('${driver.id}')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">❌ Eliminar</button>
            </div>
        `;

        driversContainer.appendChild(driverCard);
    });

    console.log("✅ Pilotos renderizados en la interfaz.");
}

// 🏎️ Mostrar modal para agregar piloto
export function showAddDriverModal() {
    const modalContent = `
        <div id="addDriverModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div class="bg-gray-800 p-6 rounded-xl shadow-lg w-96">
                <h2 class="text-lg font-bold text-white mb-4">Agregar Nuevo Piloto</h2>
                <input id="newDriverName" type="text" placeholder="Nombre" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <input id="newDriverImage" type="text" placeholder="URL de la Imagen" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <input id="newDriverTeam" type="text" placeholder="Equipo" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <input id="newDriverNumber" type="number" placeholder="Número" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <div class="flex justify-center gap-3 mt-4">
                    <button onclick="submitNewDriver()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold">✅ Agregar</button>
                    <button onclick="closeModal()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold">❌ Cancelar</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalContent);
}

// 🏎️ Enviar los datos de un nuevo piloto
export async function submitNewDriver() {
    const newDriver = {
        nombre: document.getElementById("newDriverName").value,
        url: document.getElementById("newDriverImage").value,
        team: document.getElementById("newDriverTeam").value,
        numero: document.getElementById("newDriverNumber").value
    };
    
    await addDriver(newDriver);
    await refreshDrivers();
    closeModal();
}

// 🏎️ Mostrar modal de actualización
export async function showUpdateDriverModal(driverId) {
    const drivers = await fetchDrivers();
    const driverData = drivers.find(driver => driver.id === driverId);

    if (!driverData) {
        console.error("❌ Error: No se encontró el piloto para actualizar.");
        return;
    }

    const modalContent = `
        <div id="updateDriverModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div class="bg-gray-800 p-6 rounded-xl shadow-lg w-96">
                <h2 class="text-lg font-bold text-white mb-4">Actualizar Piloto</h2>
                <input id="updateDriverName" type="text" value="${driverData.nombre}" placeholder="Nombre" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <input id="updateDriverImage" type="text" value="${driverData.url}" placeholder="URL de la Imagen" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <input id="updateDriverTeam" type="text" value="${driverData.team}" placeholder="Equipo" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <input id="updateDriverNumber" type="number" value="${driverData.numero}" placeholder="Número" class="w-full p-2 mb-3 bg-gray-700 text-white rounded-md outline-none">
                <div class="flex justify-center gap-3 mt-4">
                    <button onclick="submitUpdatedDriver('${driverId}')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold">✅ Actualizar</button>
                    <button onclick="closeModal()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold">❌ Cancelar</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalContent);
}

export function closeModal() {
    document.getElementById("addDriverModal")?.remove();
    document.getElementById("updateDriverModal")?.remove();
}
