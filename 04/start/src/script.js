import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
/*mesh.position.x = 0.7
mesh.position.y = -0.6
mesh.position.z = 1*/


mesh.position.set(0.7, -0.6, 1)
scene.add(mesh)

// Scale

mesh.scale.set(1,0.9,1)

// Rotation

mesh.rotation.y = 3.14159

// axes helper

const axes = new THREE.AxesHelper(0.1)
scene.add(axes)
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)