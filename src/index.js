const three = window.THREE = require('three')
require('three/examples/js/loaders/OBJLoader')
require('three/src/loaders/TextureLoader')

const OrbitControls = require('three-orbit-controls')(three)

const container = document.getElementById('root')

const camera = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(10, 5, 5)

const scene = new three.Scene()

const pointLight = new three.PointLight(0xffffff, 0.8)
const ambientLight = new three.AmbientLight(0xcccccc, 0.4)
camera.add(pointLight);
camera.add(ambientLight)

scene.add(camera)

// load texture
const texture = new three.TextureLoader().load('assets/textures/grid.jpg')

// render two cubes
const material = new three.MeshBasicMaterial({ map: texture })
const cube1 = new three.Mesh(new three.BoxGeometry(5, 5, 5), material)
const cube2 = new three.Mesh(new three.BoxGeometry(2, 2, 2), material)
cube2.position.z = 3.5

scene.add(cube1)
scene.add(cube2)

// render boy
new three.OBJLoader().load('assets/models/boy.obj', boy => {
  boy.traverse(child => child.isMesh ? child.material.map = texture : null)
  boy.position.x = -5
  scene.add(boy)
});

const renderer = new three.WebGLRenderer()
renderer.setClearColor(0xf0f0f0, 1.0)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

const controls = new OrbitControls(camera)
controls.enableDamping = false
controls.dampingFactor = 0.95
controls.enableZoom = true

function render() {
  renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

animate()
