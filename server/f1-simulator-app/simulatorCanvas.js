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

// 🚗 Obtener datos de autos desde la API con `mode: cors` y Headers
async function fetchCarData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/cars", {
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        const data = await response.json();
        return data.flatMap(team => team.autos);
    } catch (error) {
        console.error("❌ Error al obtener datos de la API:", error);
        return [];
    }
}

async function fetchCircuitData() {
    try {
        const response = await fetch("https://projectformula1-production.up.railway.app/api/circuits", {
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        const circuits = await response.json();
        return circuits || [];
    } catch (error) {
        console.error("❌ Error al obtener los datos de la API:", error);
        return [];
    }
}


// 🏁 Cargar el circuito como pista
async function loadCircuit() {
    const circuits = await fetchCircuitData();
    if (circuits.length === 0) return;

    const circuit = circuits[0]; // Tomamos el primer circuito
    const texture = new BABYLON.Texture(circuit.urlImagen, scene);
    const track = BABYLON.MeshBuilder.CreateGround("track", { width: 50, height: 30 }, scene);
    const material = new BABYLON.StandardMaterial("trackMaterial", scene);
    material.diffuseTexture = texture;
    track.material = material;

    console.log("✅ Circuito cargado.");
    return track;
}

// 🏎️ Cargar autos y simular la carrera sobre la pista
async function loadAndAnimateCars() {
    const cars = await fetchCarData();
    if (cars.length === 0) return;

    const carMeshes = [];

    cars.forEach((car, index) => {
        const texture = new BABYLON.Texture(car.imagen, scene);
        const plane = BABYLON.MeshBuilder.CreatePlane(`car_${index}`, { width: 2.5, height: 1.2 }, scene);
        const material = new BABYLON.StandardMaterial(`carMaterial_${index}`, scene);
        material.diffuseTexture = texture;
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material = material;
        plane.position.set(-20 + index * 5, 2, -10);
        carMeshes.push(plane);
    });

    console.log("✅ Autos cargados.");

    // 🏎️ Simular movimiento en la pista
    scene.registerBeforeRender(() => {
        carMeshes.forEach((car, index) => {
            car.position.x += Math.random() * 0.2;
            car.position.z += Math.sin(Date.now() * 0.002 + index) * 0.05;
        });
    });
}

// 🔄 **Inicializar la carrera**
async function initializeRace() {
    try {
        console.log("🚀 Iniciando carrera...");
        await loadCircuit();
        await loadAndAnimateCars();

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

// 🏁 **Iniciar la carrera**
initializeRace();
