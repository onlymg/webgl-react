import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const three = window.THREE = require('three')
const OrbitControls = require('three-orbit-controls')(three)

require('three/examples/js/loaders/OBJLoader')
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
    this.camera.add(new three.PointLight(0xffffff, 0.8))
    this.camera.add(new three.AmbientLight(0xcccccc, 0.4))
    
    // add camera to scene
    this.scene.add(this.camera)

    // init renderer
    this.renderer = new three.WebGLRenderer()
    this.renderer.setClearColor(0xf0f0f0, 1.0)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)

    // append canvas
    this.container.appendChild(this.renderer.domElement)

    // controls
    const controls = new OrbitControls(this.camera)
    controls.enableDamping = true
    controls.dampingFactor = 0.95
    controls.enableZoom = true

    // add objects from props
    this.props.objects.forEach(element => this.scene.add(element))

    // render
    this.start()
  }


  componentWillReceiveProps(nextProps) {
    console.log(1)
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

class Model extends Component {
  render() {
    return null
  }
}

class App extends Component {

  constructor() {
    super()
    this.state = {
      objectOffset: 0,
      objects: []
    }
  }

  componentDidMount() {

    // example cubes
    const texture = new three.TextureLoader().load('assets/textures/grid.jpg')
    const material = new three.MeshPhongMaterial({ map: texture })
    const cube1 = new three.Mesh(new three.BoxGeometry(5, 5, 5), material)
    const cube2 = new three.Mesh(new three.BoxGeometry(2, 2, 2), material)
    cube2.position.z = 3.5
    this.objectOffset = 2

    this.setState({ ...this.state, objects: [ cube1, cube2 ] })
  }

  addCube() {

    // adds cube with random color and width to scene

    const x = getRandomInteger(1, 5)
    const material = new three.MeshPhongMaterial({ color: getRandomColor() })
    const cube = new three.Mesh(new three.BoxGeometry(x, x, x), material)

    cube.position.z = 5 * this.objectOffset
    this.objectOffset++

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