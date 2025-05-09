import * as BABYLON from 'babylonjs';
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders";
import { GLTFFileLoader } from "@babylonjs/loaders";

// 🎯 Configuración del Escenario
const canvas = document.getElementById("raceCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// 📷 Configuración de Cámara
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 3, Math.PI / 4, 100, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// 🌞 Luz Ambiental
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.8;

// 🚗 Obtener datos de autos desde la API
async function fetchCarData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/cars");
        if (!response.ok) throw new Error("❌ Error al obtener datos de los autos.");
        const data = await response.json();
        return data.flatMap(team => team.autos);
    } catch (error) {
        console.error("🚨 Error en fetchCarData:", error.message);
        return [];
    }
}

// 🏁 Obtener datos de circuitos desde la API
async function fetchCircuitData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/circuits");
        if (!response.ok) throw new Error("❌ Error al obtener circuitos.");
        return await response.json();
    } catch (error) {
        console.error("🚨 Error en fetchCircuitData:", error.message);
        return [];
    }
}

// 🏎️ Cargar opciones dinámicas en los select
async function loadOptions() {
    const carSelect = document.getElementById("car-select");
    const trackSelect = document.getElementById("track-select");

    if (!carSelect || !trackSelect) {
        console.error("❌ No se encontraron los elementos de selección.");
        return;
    }

    // 🚗 Cargar autos
    const cars = await fetchCarData();
    cars.forEach(car => {
        const option = document.createElement("option");
        option.value = car.imagen;
        option.textContent = `${car.modelo} - ${car.motor}`;
        carSelect.appendChild(option);
    });

    // 🏁 Cargar circuitos
    const tracks = await fetchCircuitData();
    tracks.forEach(track => {
        const option = document.createElement("option");
        option.value = track.urlImagen;
        option.textContent = track.nombre;
        trackSelect.appendChild(option);
    });

    console.log("✅ Opciones de autos y pistas cargadas correctamente.");
}

// 🏁 Cargar pista seleccionada
async function loadCircuit(trackImage) {
    console.log("🔍 Cargando pista con imagen:", trackImage);

    const texture = new BABYLON.Texture(trackImage, scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, () => {
        console.log("✅ Textura del circuito cargada correctamente.");
    }, (error) => {
        console.error("❌ Error al cargar la textura del circuito:", error);
    });

    const track = BABYLON.MeshBuilder.CreateGround("track", { width: 200, height: 100 }, scene);
    const material = new BABYLON.StandardMaterial("trackMaterial", scene);
    material.diffuseTexture = texture;
    track.material = material;
    track.position.y = -2;

    console.log("✅ Circuito creado y aplicado.");
}

// 🏎️ Cargar autos y simular la carrera
async function loadAndAnimateCars(carImage) {
    console.log("🔍 Cargando auto con imagen:", carImage);

    const texture = new BABYLON.Texture(carImage, scene);
    const car = BABYLON.MeshBuilder.CreatePlane("selectedCar", { width: 2.5, height: 1.2 }, scene);
    const material = new BABYLON.StandardMaterial("carMaterial", scene);
    material.diffuseTexture = texture;
    car.material = material;
    car.position.set(-50, 2, 0);

    console.log("✅ Auto seleccionado cargado.");

    scene.registerBeforeRender(() => {
        car.position.x += Math.random() * 0.4;
    });
}

// 🏁 **Control de inicio**
// 🏁 **Control de inicio**
document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementById("start-btn");
    const carSelect = document.getElementById("car-select");
    const trackSelect = document.getElementById("track-select");
    const canvasContainer = document.getElementById("canvas-container");

    if (canvasContainer) canvasContainer.style.display = "none";

    await loadOptions();

    startButton.addEventListener("click", () => {
        console.log("🏁 Simulación iniciada!");
        saveSelection(); // ✅ Guardar selección y generar una nueva card

        const selectedCar = carSelect.value;
        const selectedTrack = trackSelect.value;
        console.log(`🚗 Auto seleccionado: ${selectedCar}, 🏁 Pista seleccionada: ${selectedTrack}`);

        canvasContainer.style.display = "block";

        initializeRace(selectedCar, selectedTrack);
    });
});
const fetchWeatherData = async () => {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/weather");
        if (!response.ok) throw new Error("❌ Error al obtener datos del clima.");

        const data = await response.json();
        console.log("🌦️ Clima obtenido:", data);

        if (!data || !data.length) {
            throw new Error("❌ La API no devolvió datos de clima válidos.");
        }

        const weatherSelect = document.getElementById("weather-select");

        if (!weatherSelect) {
            console.error("❌ No se encontró el elemento `weather-select` en el DOM.");
            return;
        }

        // 🔄 Generar opciones con datos de la API
        weatherSelect.innerHTML = "";
        data.forEach((weatherInfo) => {
            const option = document.createElement("option");
            option.value = weatherInfo.categoria.toLowerCase();
            option.textContent = `${weatherInfo.categoria} | Temp Pista: ${weatherInfo.trackTemperature}°C | Viento: ${weatherInfo.windSpeed} km/h`;
            weatherSelect.appendChild(option);
        });

        console.log("✅ Climas cargados correctamente.");
    } catch (error) {
        console.error("🚨 Error al cargar el clima:", error.message);
    }
};


fetchWeatherData();

// 📌 **Mostrar selección en la card**
function updateSelectionCard() {
    const selectionContainer = document.getElementById("selection-container"); // ✅ Contenedor que almacena múltiples cards
    if (!selectionContainer) {
        console.error("❌ No se encontró el elemento `selection-container` en el DOM.");
        return;
    }

    // 📌 Configurar `selection-container` para mostrar las cards en filas
    selectionContainer.style.display = "flex";
    selectionContainer.style.flexDirection = "row"; // ✅ Organizar en filas
    selectionContainer.style.flexWrap = "wrap"; // ✅ Permitir que haya múltiples filas si hay muchas simulaciones
    selectionContainer.style.gap = "16px"; // ✅ Espaciado entre las cards

    const selectedCar = localStorage.getItem("selectedCar");
    const selectedTrack = localStorage.getItem("selectedTrack");
    const selectedWeather = localStorage.getItem("selectedWeather");

    // 📌 Crear nueva card
    const newCard = document.createElement("div");
    newCard.className = "bg-gray-800 text-white p-4 rounded-lg w-80 flex flex-col items-center shadow-lg";
    newCard.innerHTML = `
        <h2 class="text-xl font-bold mb-3">🏎️ Simulación ${selectionContainer.childElementCount + 1}</h2>

        <div class="flex flex-col items-center">
            <img src="${selectedCar}" alt="Auto Seleccionado" class="w-40 h-24 object-cover rounded-lg border-2 border-gray-500">
            <p class="mt-2"><strong>🚗 Auto:</strong> ${selectedCar ? "Seleccionado" : "No seleccionado"}</p>
        </div>

        <div class="flex flex-col items-center mt-4">
            <img src="${selectedTrack}" alt="Pista Seleccionada" class="w-60 h-32 object-cover rounded-lg border-2 border-gray-500">
            <p class="mt-2"><strong>🏁 Pista:</strong> ${selectedTrack ? "Seleccionada" : "No seleccionada"}</p>
        </div>

        <p class="mt-4 text-lg"><strong>🌦️ Clima:</strong> ${selectedWeather || "No seleccionado"}</p>
    `;

    // 📌 Agregar card al contenedor
    selectionContainer.appendChild(newCard);
}


// 📌 **Guardar selección en localStorage y mostrar una nueva card**
function saveSelection() {
    const selectedCar = document.getElementById("car-select").value;
    const selectedTrack = document.getElementById("track-select").value;
    const selectedWeather = document.getElementById("weather-select").value;

    localStorage.setItem("selectedCar", selectedCar);
    localStorage.setItem("selectedTrack", selectedTrack);
    localStorage.setItem("selectedWeather", selectedWeather);

    updateSelectionCard(); // ✅ Generar una nueva card en cada simulación
}
// 🔄 **Inicializar carrera con clima**
async function initializeRace(carImage, trackImage, weatherCondition) {
    try {
        console.log(`🚀 Carrera con ${carImage} en ${trackImage} bajo clima ${weatherCondition}...`);

        await loadCircuit(trackImage);
        await loadAndAnimateCars(carImage, weatherCondition);

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });

    } catch (error) {
        console.error("❌ Error en la simulación:", error);
    }
}
