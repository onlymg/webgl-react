import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const three = window.THREE = require('three')

require('three/examples/js/loaders/OBJLoader')
require('three/examples/js/controls/OrbitControls')
require('three/src/loaders/TextureLoader')

class Renderer extends Component {

  componentDidMount() {

    const width = window.innerWidth, 
          height = window.innerHeight * 0.9

    // init camera
    this.camera = new three.PerspectiveCamera(45, width / height, 1, 1000)
    this.camera.position.set(0, 0, 20)

    // add the scene to render in
    this.scene = new three.Scene()
    
    // add light to scene
    const light = new three.DirectionalLight(0xffffff, 0.9)
    light.castShadow = true
    light.position.set(20, 20, 0)

    this.camera.add(light)
    this.camera.add(new three.AmbientLight(0xffffff, 0.9))

    // add a plane 
    const planeGeometry = new THREE.PlaneBufferGeometry(60, 60, 22, 22)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.position.z = -2.5
    this.scene.add(plane)

    // add camera to scene
    this.scene.add(this.camera)

    // init renderer
    this.renderer = new three.WebGLRenderer()
    this.renderer.setClearColor(0xf0f0f0, 1.0)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = three.PCFSoftShadowMap;

    // append canvas
    this.container.appendChild(this.renderer.domElement)

    // controls
    const controls = new three.OrbitControls(this.camera)
    controls.enableDamping = true
    controls.dampingFactor = 0.99
    controls.enableZoom = true

    // add objects from props
    this.props.objects.forEach(element => this.scene.add(element))

    // render
    this.start()
  }


  componentWillReceiveProps(nextProps) {
    if(this.props.objects !== nextProps.objects) {
      this.props.objects.forEach(element => this.scene.remove(element))
      nextProps.objects.forEach(element => this.scene.add(element))
    }
  }

  shouldComponentUpdate() {
    return false
  }

  start() {
    // start the browser animation
    if (!this.frameID) {
      this.frameID = requestAnimationFrame(this.animate.bind(this))
    }
  }

  stop() {
    // cancels the browser animation
    cancelAnimationFrame(this.frameID)
  }

  animate() {
    this.frameID = requestAnimationFrame(this.animate.bind(this))
    this.renderScene()
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  componentWillUnmount() {
    this.stop()
    this.container.removeChild(this.renderer.domElement)
  }

  render() {
    return <div ref={elem => this.container = elem} />
  }
}

class App extends Component {

  constructor() {
    super()
    this.objectOffset = 0
    this.state = {
      objects: []
    }
  }

  componentDidMount() {

    // example cubes
    const texture = new three.TextureLoader().load('assets/textures/grid.jpg')
    const material = new three.MeshStandardMaterial({ map: texture })
    const cube1 = new three.Mesh(new three.BoxBufferGeometry(5, 5, 5), material)
    const cube2 = new three.Mesh(new three.BoxBufferGeometry(2, 2, 2), material)
    
    cube1.castShadow = true; 
    cube1.receiveShadow = true; 
    cube2.castShadow = true; 
    cube2.receiveShadow = true; 

    cube2.position.z = 3.5
    
    this.objectOffset++
    this.objectOffset++

    this.setState({ ...this.state, objects: [ cube1, cube2 ] })
  }

  addCube() {

    // adds cube with random color and width to scene

    const x = getRandomInteger(1, 5)
    const material = new three.MeshStandardMaterial({ color: getRandomColor() })
    const cube = new three.Mesh(new three.BoxGeometry(x, x, x), material)
    cube.castShadow = true
    cube.receiveShadow = true

    cube.position.z = 5 * this.objectOffset++

    this.setState({ ...this.state, objects: [ ...this.state.objects, cube ] })
  }

  render() {
    return (
      <div>
        <Renderer objects={this.state.objects} />
        <div style={{ padding: 20 }}>
          <button onClick={this.addCube.bind(this)}>Add Cube</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))


function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return Math.floor(Math.random() * 16777215)
}