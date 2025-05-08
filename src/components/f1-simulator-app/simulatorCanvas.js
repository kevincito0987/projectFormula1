import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.cjs';
import { TextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/loaders/TextureLoader.js';

// 🎯 Configuración del Escenario
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🏎️ Cargar circuito desde API
async function loadCircuit() {
    const response = await fetch('https://projectformula1-production.up.railway.app/api/circuits');
    const circuits = await response.json();
    const circuitBahrein = circuits.find(c => c.circuitId === 'bahrein');

    const textureLoader = new TextureLoader();
    const texture = await textureLoader.loadAsync(circuitBahrein.urlImagen);

    const planeGeometry = new THREE.PlaneGeometry(50, 30);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const track = new THREE.Mesh(planeGeometry, planeMaterial);
    track.rotation.x = -Math.PI / 2;
    scene.add(track);
}

// 🚗 Cargar autos en la pista desde URLs externas
const carModels = [
    'https://www.dropbox.com/scl/fi/2yui591dv0zpdfo8anoo6/scuderia_ferrari_f1_sf23_2023.glb?dl=0',
    'https://www.dropbox.com/scl/fi/r2ivzna1gzop10hf8t9av/red_bull_racing.glb?dl=0',
    'https://www.dropbox.com/scl/fi/a7v18v52s30sxxqzxbsjd/oracle_red_bull_f1_car_rb19_2023.glb?dl=0',
    'https://www.dropbox.com/scl/fi/q2tmdaqnf2y3skzcbsmpz/mclaren_mcl60_f1_2023.glb?dl=0',
    'https://www.dropbox.com/scl/fi/n0cwfwybt25e130psvn54/lotus_renault_f1_car_free_download.glb?dl=0',
    'https://www.dropbox.com/scl/fi/b3gj00qxgkps5fvyxwvl0/ferrari_f1_2019.glb?dl=0',
    'https://www.dropbox.com/scl/fi/etv2uimwy5mjeinnggdu6/f1_mercedes_w13_concept.glb?dl=0',
    'https://www.dropbox.com/scl/fi/kvgvoacm5ubzenwrr3vja/car12.glb?dl=0'
];

const carPositions = [{ x: -10, z: 0 }, { x: -5, z: 0 }, { x: 0, z: 0 }];

function loadCars() {
    const loader = new GLTFLoader();

    carModels.forEach((modelUrl, index) => {
        loader.load(modelUrl, (gltf) => {
            const car = gltf.scene;
            car.position.set(carPositions[index].x, 0, carPositions[index].z);
            scene.add(car);
        });
    });
}

// 📸 Posición de cámara
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// 🎬 Animación de la escena
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 🏁 Cargar pista y autos
loadCircuit();
loadCars();
animate();
