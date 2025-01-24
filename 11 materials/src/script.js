import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader.js";
import {log} from "three/nodes";

//debug

//const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const loadingManager = new THREE.LoadingManager()

const textureLoader = new THREE.TextureLoader(loadingManager)

function loadingChecker(manager) {
    manager.onStart = () => {
        console.log('onStart')
    }
    manager.onLoad = () => {
        console.log('onLoad')
    }
    manager.onProgress = () => {
        console.log('onProgress')
    }
    manager.onError = (e) => {
        console.log('onError', e)
    }
}

//loadingChecker(loadingManager);

//light
const pointLight = new THREE.PointLight(0xfffff, 100); // Белый свет, интенсивность 1
pointLight.position.set(5, 5, 5); // Расположите свет в сцене
scene.add(pointLight);

const textures =
    [
        textureLoader.load('./textures/fire/color.jpg'),
        textureLoader.load('./textures/water/color.jpg'),
        textureLoader.load('./textures/earth/color.jpg')
    ]
const geometries =
    [
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.CylinderGeometry(0.5, 0.5, 1, 8)
    ]
const inputs = ['input_Y', 'input_X', 'input_Z'].map(id => document.getElementById(id));
let coordinates = [ null, null, null ]

textures.forEach(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
})

const materials = textures.map( texture =>
{
    const material = new THREE.MeshPhysicalMaterial();
    material.roughness = 1;
    material.metalness = 1;
    material.clearcoat = 1;
    material.clearcoatRoughness = 0;
    material.side = THREE.DoubleSide;
    material.map = texture;
    return material
});

document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    scene.clear();
    const inputs = ['input_Y', 'input_X', 'input_Z'].map(id => Number(document.getElementById(id).value));
    const [Y, X, Z] = inputs;

    createFiguresCube(Y, X, Z);

    inputs.forEach((_, index) => (document.getElementById(['input_Y', 'input_X', 'input_Z'][index]).value = ''));
});
function createFiguresCube(Y, X, Z) {
    let objects = []
    for (let y = 0; y < Y; y++) {
        for (let x = 0; x < X; x++) {
            for (let z = 0; z < Z; z++) {
                // Создаем фигуру
                const material = materials[Math.floor(Math.random() * materials.length)];
                const geometryType = Math.floor(Math.random() * geometries.length);

                const mesh = new THREE.Mesh(geometries[geometryType], material);
                mesh.position.set(Math.random() * 5 -2.5,Math.random() * 5 -2.5,Math.random() * 5 -2.5);


                mesh.position.set(x, y, z);

                objects.push(mesh);
                scene.add(mesh)
            }
        }
    }
}




//Environment map
const loader = new RGBELoader();
loader.load('textures/environmentMap/2k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping; // Настраиваем тип маппинга
    scene.environment = texture; // Устанавливаем как карту окружения
    scene.background = texture;  // Устанавливаем как фон сцены
});

//   Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 8
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


//Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)


// Animate

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    /* sphere.rotation.x = 0.1 * elapsedTime
     box.rotation.x = 0.1 * elapsedTime

     sphere.rotation.y = 0.1 * elapsedTime
     box.rotation.y = 0.1 * elapsedTime
 */
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()