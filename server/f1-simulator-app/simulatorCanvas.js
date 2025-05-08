import * as BABYLON from 'babylonjs';
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders"; 
import { GLTFFileLoader } from "@babylonjs/loaders"; 

// 🎯 Configuración del Escenario
const canvas = document.getElementById("raceCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// 📷 Configuración de Cámara
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 3, Math.PI / 4, 80, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// 🌞 Luz Ambiental
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// 🚗 Obtener datos de autos desde la API con formato correcto
async function fetchCarData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/cars");
        const data = await response.json();
        return data.flatMap(team => team.autos); // 🔄 Extraer los autos de cada equipo
    } catch (error) {
        console.error("❌ Error al obtener datos de los autos:", error);
        return [];
    }
}

// 🏁 Obtener datos de circuitos desde la API
async function fetchCircuitData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/circuits");
        const circuits = await response.json();
        return circuits;
    } catch (error) {
        console.error("❌ Error al obtener los datos de la API:", error);
        return [];
    }
}

// 🏎️ Cargar opciones dinámicas en los select
async function loadOptions() {
    const carSelect = document.getElementById("car-select");
    const trackSelect = document.getElementById("track-select");

    if (!carSelect || !trackSelect) return console.error("❌ No se encontraron los elementos de selección.");

    // 🚗 Cargar autos en el select respetando la estructura de la API
    const cars = await fetchCarData();
    cars.forEach(car => {
        const option = document.createElement("option");
        option.value = car.imagen; // 🔄 Usamos la imagen para la simulación
        option.textContent = `${car.modelo} - ${car.motor}`;
        carSelect.appendChild(option);
    });

    // 🏁 Cargar circuitos en el select
    const tracks = await fetchCircuitData();
    tracks.forEach(track => {
        const option = document.createElement("option");
        option.value = track.urlImagen;
        option.textContent = track.nombre;
        trackSelect.appendChild(option);
    });

    console.log("✅ Opciones de autos y pistas cargadas correctamente.");
}

// 🏁 Cargar el circuito como pista seleccionada
async function loadCircuit(trackImage) {
    const texture = new BABYLON.Texture(trackImage, scene);
    const track = BABYLON.MeshBuilder.CreateGround("track", { width: 50, height: 30 }, scene);
    const material = new BABYLON.StandardMaterial("trackMaterial", scene);
    material.diffuseTexture = texture;
    track.material = material;

    console.log("✅ Circuito cargado.");
    return track;
}

// 🏎️ Cargar autos y simular la carrera con el auto seleccionado
async function loadAndAnimateCars(carImage) {
    const carMeshes = [];
    const texture = new BABYLON.Texture(carImage, scene);
    const plane = BABYLON.MeshBuilder.CreatePlane("selectedCar", { width: 2.5, height: 1.2 }, scene);
    const material = new BABYLON.StandardMaterial("carMaterial", scene);
    material.diffuseTexture = texture;
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material = material;
    plane.position.set(-20, 2, -10);
    carMeshes.push(plane);

    console.log("✅ Auto seleccionado cargado.");

    // 🏎️ Simulación de movimiento
    scene.registerBeforeRender(() => {
        carMeshes.forEach(car => {
            car.position.x += Math.random() * 0.2;
            car.position.z += Math.sin(Date.now() * 0.002) * 0.05;
        });
    });
}

// 🏁 **Control de inicio**
document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementById("start-btn");
    const carSelect = document.getElementById("car-select");
    const trackSelect = document.getElementById("track-select");
    const canvasContainer = document.getElementById("canvas-container");

    if (canvasContainer) canvasContainer.style.display = "none";

    await loadOptions();

    if (startButton) {
        startButton.addEventListener("click", () => {
            console.log("🏁 Simulación iniciada!");

            const selectedCar = carSelect.value;
            const selectedTrack = trackSelect.value;
            console.log(`🚗 Auto seleccionado: ${selectedCar}, 🏁 Pista seleccionada: ${selectedTrack}`);

            // 🟢 Mostrar el canvas
            canvasContainer.style.display = "block";

            // 🏎️ Iniciar la simulación con el auto y la pista seleccionados
            initializeRace(selectedCar, selectedTrack);
        });
    }
});

// 🔄 **Inicializar la carrera con selección de auto y pista**
async function initializeRace(carImage, trackImage) {
    try {
        console.log(`🚀 Iniciando carrera con ${carImage} en ${trackImage}...`);

        await loadCircuit(trackImage);
        await loadAndAnimateCars(carImage);

        console.log("🎬 Simulación en progreso...");
        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });

    } catch (error) {
        console.error("❌ Error durante la simulación:", error);
    }
}
