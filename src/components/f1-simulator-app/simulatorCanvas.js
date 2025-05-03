// 🏎️ Configuración del circuito en Canvas API
async function drawCircuit() {
    const canvas = document.getElementById('circuitCanvas');
    const ctx = canvas.getContext('2d');

    const response = await fetch('https://projectformula1-production.up.railway.app/api/circuits');
    const circuits = await response.json();
    const circuitBahrein = circuits.find(c => c.circuitId === 'bahrein');

    const image = new Image();
    image.src = circuitBahrein.urlImagen;

    image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
}

// 🚀 Configuración de Three.js para los autos
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const carModels = [
    'https://www.dropbox.com/scl/fi/2yui591dv0zpdfo8anoo6/scuderia_ferrari_f1_sf23_2023.glb?rlkey=6qm59cm9rkd2b7nc9j9amqctk&st=0kv9c307&dl=0',
    'https://www.dropbox.com/scl/fi/r2ivzna1gzop10hf8t9av/red_bull_racing.glb?rlkey=znlkl88izv7td5ny8wi9o2sri&st=c2nhi2wj&dl=0',
    'https://www.dropbox.com/scl/fi/a7v18v52s30sxxqzxbsjd/oracle_red_bull_f1_car_rb19_2023.glb?rlkey=cel18ramco0pjnqshvklogm4c&st=t87wx343&dl=0',
    'https://www.dropbox.com/scl/fi/q2tmdaqnf2y3skzcbsmpz/mclaren_mcl60_f1_2023.glb?rlkey=9oo73kft1zaebjim4ryfz7mzb&st=y9jnsg24&dl=0',
    'https://www.dropbox.com/scl/fi/n0cwfwybt25e130psvn54/lotus_renault_f1_car_free_download.glb?rlkey=ohwhswyvntg7hpal5yzypa8bd&st=ih2gpa8i&dl=0',
    'https://www.dropbox.com/scl/fi/b3gj00qxgkps5fvyxwvl0/ferrari_f1_2019.glb?rlkey=mr9cj3n7hsa9rplp65r22v8tk&st=eqsb7a5o&dl=0',
    'https://www.dropbox.com/scl/fi/etv2uimwy5mjeinnggdu6/f1_mercedes_w13_concept.glb?rlkey=qii1vzyvv49okv73lje0s7ek0&st=ygvuwnvf&dl=0',
    'https://www.dropbox.com/scl/fi/kvgvoacm5ubzenwrr3vja/car12.glb?rlkey=crhv2xjhixk5m64mwiect5fo0&st=phnf08fk&dl=0'
];

const carPositions = [
    { x: -10, z: 0 }, { x: -5, z: 0 }, { x: 0, z: 0 }, { x: 5, z: 0 },
    { x: 10, z: 5 }, { x: -10, z: 5 }, { x: -5, z: 5 }, { x: 0, z: 5 }
];

function loadCarModels() {
    const loader = new THREE.GLTFLoader();

    for (let i = 0; i < 8; i++) {
        loader.load(carModels[i], (gltf) => {
            const car = gltf.scene;
            car.position.set(carPositions[i].x, 0, carPositions[i].z);
            scene.add(car);
        });
    }
}

loadCarModels();


// Cargar los 8 autos en sus posiciones
carPositions.forEach(pos => loadCarModel(pos));

camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// 🎬 Animación de la escena
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
drawCircuit();
