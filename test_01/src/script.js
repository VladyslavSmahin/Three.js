import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader.js";
import {gsap} from "gsap";

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

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

textures.forEach(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
})

const materials = textures.map(texture => {
    const material = new THREE.MeshPhysicalMaterial();
    material.roughness = 1;
    material.metalness = 0.5;
    material.clearcoat = 1;
    material.clearcoatRoughness = 0;
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
let objects = [];
let initialPositions = [];

function createFiguresCube(Y, X, Z) {

    const xOffset = -0.5 * (X - 1);
    const yOffset = -0.5 * (Y - 1);
    const zOffset = -0.5 * (Z - 1);

    for (let y = 0; y < Y; y++) {
        for (let x = 0; x < X; x++) {
            for (let z = 0; z < Z; z++) {

                const material = materials[Math.floor(Math.random() * materials.length)];
                const geometryType = Math.floor(Math.random() * geometries.length);

                const mesh = new THREE.Mesh(geometries[geometryType], material);

                const posX = x + xOffset;
                const posY = y + yOffset;
                const posZ = z + zOffset;

                mesh.position.set(posX, posY, posZ);

                objects.push(mesh);
                initialPositions.push([posX, posY, posZ]);
                scene.add(mesh)

            }
        }
    }
    //positions = objects.map(obj => obj.position.toArray());
    controls.addEventListener('change', () => {
        cameraTarget.x = camera.position.x;
        cameraTarget.y = camera.position.y;
        cameraTarget.z = camera.position.z;
    });
}

//Environment map
const loader = new RGBELoader();
loader.load('textures/environmentMap/2k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//разобраться с крайними точками
let cameraTarget = {x: camera.position.x, y: camera.position.y, z: camera.position.z};

// tween init // оставляю для разбора
/*

let cameraTween = null;
let explodeTween = null;
let randomPositions = [];
const endValuesExplodeBtn = { x: camera.position.x, y: camera.position.y, z: camera.position.z+15 };

    cameraTween = new Tween(cameraTarget).easing(Easing.Quadratic.InOut).to(endValuesExplodeBtn, 1000)
        .onUpdate(() => {
            camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
            camera.lookAt(0, 0, 0);
            console.log('onUpd')
        });
    /!*explodeTween = new Tween(positions).easing(Easing.Quadratic.InOut)
        .onUpdate(() => {

            objects.forEach((obj, i) => {
                const [x, y, z] = positions[i];
                obj.position.set(x, y, z);
            });
        })
        .onComplete(() => {
            console.log(randomPositions)
            console.log('Explode animation complete');
        });

document.getElementById('explodeBtn').addEventListener('click', () => {
   /!* cameraTween.chain(explodeTween);*!/
    if (cameraTween) {
        cameraTween.start();
    }
    else if (explodeTween){
        console.log(`explodeTween`, positions)

        randomPositions = positions.map(() => [
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
        ]);
        console.log(randomPositions)

        explodeTween.to(randomPositions, 1000).start().onComplete(() => {
            console.log(positions);
        });

    } else console.log('explodeTween  err')

});*!/

*/

function moveObjectsAndCamera(offsetY, offsetX, offsetZ, duration = 1) {
    // Анимация объектов
    objects.forEach(obj => {
        const targetX = obj.position.x + offsetX;
        const targetY = obj.position.y + offsetY;
        const targetZ = obj.position.z + offsetZ;

        gsap.to(obj.position, {
            duration,
            x: targetX,
            y: targetY,
            z: targetZ,
            ease: 'power2.out'
        });
    });


    const cameraX = 0;
    const cameraY = 0;
    const cameraZ = 30;
    gsap.to(camera.position, {
        duration: 1,
        x: cameraX,
        y: cameraY,
        z: cameraZ,
        ease: 'power2.out'
    });
}

document.getElementById('explodeBtn').addEventListener('click', () => {

    objects.forEach(obj => {
        const targetX = (Math.random() * 40) - 20;
        const targetY = (Math.random() * 40) - 20;
        const targetZ = (Math.random() * 40) - 20;

        gsap.to(obj.position, {
            delay: 1.6,
            duration: Math.random() * 3,
            x: targetX,
            y: targetY,
            z: targetZ,
            ease: 'power2.out'
        });

        gsap.to(obj.rotation, {
            delay: 2,
            duration: 4,
            x: +Math.PI * 2,
            ease: 'power2.out'
        })
    })
    const cameraX = cameraTarget.x;
    const cameraY = cameraTarget.y;
    const cameraZ = 40;

    gsap.to(camera.position, {
        duration: 3,
        x: cameraX,
        y: cameraY,
        z: cameraZ,
        ease: 'power2.out'
    });
});

window.addEventListener('keydown', (event) => {

    if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
        objects.forEach(obj => {
            let targetX;
            let targetY;
            let targetZ
            if (event.key === 'w' || event.key === 'ц') {
                targetX = (Math.random() * 40) - 20;
                targetY = 10;
                targetZ = (Math.random() * 40) - 20;
            } else if (event.key === 'a' || event.key === 'ф') {
                targetX = -10;
                targetY = (Math.random() * 40) - 20;
                targetZ = (Math.random() * 40) - 20;
            } else if (event.key === 's' || event.key === 'ы') {
                targetX = (Math.random() * 40) - 20;
                targetY = -10;
                targetZ = (Math.random() * 40) - 20;
            } else if (event.key === 'd' || event.key === 'в') {
                targetX = 10
                targetY = (Math.random() * 40) - 20;
                targetZ = (Math.random() * 40) - 20;
            }
            gsap.to(obj.position, {
                duration: Math.random() * 3,
                x: targetX,
                y: targetY,
                z: targetZ,
                ease: 'power2.out'
            });
        });
        const cameraX = 0;
        const cameraY = 0;
        const cameraZ = 30;
        gsap.to(camera.position, {
            duration: 1,
            x: cameraX,
            y: cameraY,
            z: cameraZ,
            ease: 'power2.out'
        });
    }
});
document.getElementById('collectBtn').addEventListener('click', () => {
    objects.forEach((obj, index) => {
        const [targetX, targetY, targetZ] = initialPositions[index];

        gsap.to(obj.position, {
            duration: Math.random() * 5,
            x: targetX,
            y: targetY,
            z: targetZ,
            ease: 'power2.out'
        });
    });
    const cameraX = 0;
    const cameraY = 0;
    const cameraZ = 5;
    gsap.to(camera.position, {
        delay: 4,
        duration: 1,
        x: cameraX,
        y: cameraY,
        z: cameraZ,
        ease: 'power2.out'
    });
});

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

animate();
const clock = new THREE.Clock();
function animate(time) {
    requestAnimationFrame(animate);
    controls.update();
    //cameraTween.update(time);

    renderer.render(scene, camera);
}
