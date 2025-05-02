import * as BABYLON from "babylonjs";  // 📌 Importar Babylon.js instalado

// 🔗 Obtener el canvas
const canvas = document.getElementById("renderCanvas"); 

// 🔥 Crear el motor de Babylon.js
const engine = new BABYLON.Engine(canvas, true); 

// 🌍 Crear la escena
const scene = new BABYLON.Scene(engine);

// 📸 Configurar la cámara
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// 💡 Agregar una luz
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// 🏎️ Crear un objeto básico (auto)
const car = BABYLON.MeshBuilder.CreateBox("car", { width: 2, height: 1, depth: 4 }, scene);
car.position.y = 0.5;
car.material = new BABYLON.StandardMaterial("carMat", scene);
car.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // 🔴 Color rojo para el auto

// 🔄 Renderizar la escena
engine.runRenderLoop(() => {
    scene.render();
});

// 📏 Ajustar cuando cambia el tamaño de la ventana
window.addEventListener("resize", () => {
    engine.resize();
});
