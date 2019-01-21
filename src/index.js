import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const three = window.THREE = require('three')

require('three/examples/js/loaders/OBJLoader')
require('three/examples/js/loaders/STLLoader')
require('three/examples/js/controls/OrbitControls')
require('three/src/loaders/TextureLoader')

class Renderer extends Component {

  componentDidMount() {

    const width = window.innerWidth, 
          height = window.innerHeight * 0.9

    // init camera
    this.camera = new three.PerspectiveCamera(45, width / height, 1, 10000)
    this.camera.position.set(-5, 5, 5)

    // add the scene to render in
    this.scene = new three.Scene()
    // this.scene.fog = new three.Fog(0x333333, 5, 40)
    
    // add light to scene
    const light = new three.SpotLight(0xffffff, 1)
    light.position.set(-50, 50, 0)

    // const h = new three.SpotLightHelper(light, 1, 0x333333)
    // this.scene.add(h)
    
    
    this.scene.add(light)

    // new three.
    this.scene.add(new three.AmbientLight(0xffffff, 0.9))



    const axes = new THREE.AxesHelper(10);
    this.scene.add(axes);

    // add a plane 
    // const planeGeometry = new three.PlaneBufferGeometry(60, 60)
    // const planeMaterial = new three.MeshStandardMaterial({ color: 0xffffff })
    // const plane = new three.Mesh(planeGeometry, planeMaterial)
    // plane.receiveShadow = true
    // plane.position.z = 0
    // this.scene.add(plane)

    // add object
    // new three.OBJLoader().load('assets/models/boy.obj', geometry => {
    //   // const material = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 })
    //   // const obj = new three.Mesh(geometry, material)
    //   this.scene.add(geometry)
    // })

    // example texture
    const texture = new three.TextureLoader().load('assets/textures/grid.jpg')

    // one unit is 10 cm
    const worldScale = 1 / 100


    // add object
    new three.STLLoader().load('assets/models/test.stl', geometry => {
      const material = new THREE.MeshStandardMaterial({ color: 'darkslategrey', specular: 0x111111, shininess: 200 })
      const obj = new three.Mesh(geometry, material)      
      obj.scale.y = worldScale
      obj.scale.x = worldScale
      obj.scale.z = worldScale
      obj.position.set(0,0,0)
      obj.rotateX(- Math.PI / 2)
      this.scene.add(obj)
    })

    new three.STLLoader().load('assets/models/test.stl', geometry => {
      const material = new THREE.MeshStandardMaterial({ color: 'slateblue', specular: 0x111111, shininess: 200 })
      const obj = new three.Mesh(geometry, material)
      obj.scale.y = worldScale
      obj.scale.x = worldScale
      obj.scale.z = worldScale
      obj.position.set(0,0,-1.5)      
      obj.rotateX(- Math.PI / 2)
      this.scene.add(obj)
    })


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
    this.controls = new three.OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.1
    this.controls.enableZoom = true
    this.controls.rotateSpeed = 0.05

    this.controls.enablePan = true
    this.controls.screenSpacePanning = true
    this.controls.panSpeed = 0.05
    // this.controls.maxDistance = 1000
    // this.controls.minDistance = 10
    // this.controls.autoRotate = true
    // this.controls.autoRotateSpeed = 0.5
    // this.controls.maxAzimuthAngle = Math.PI / 2
    // this.controls.minAzimuthAngle = - Math.PI / 2
    // this.controls.maxPolarAngle = Math.PI
    // this.controls.minPolarAngle = - Math.PI / 2

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
    this.controls.update()
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
    const texture = new three.TextureLoader().load('assets/textures/quad.jpg')
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

    // this.setState({ ...this.state, objects: [ cube1, cube2 ] })

  }

  addCube() {
    // adds cube with random color and width to scene
    const textures = [ 'metal', 'tiles', 'grid' ]
    const texture = new three.TextureLoader().load(`assets/textures/${ textures[getRandomInteger(0, textures.length-1)] }.jpg`)
    const x = getRandomInteger(1, 5)
    const material = new three.MeshStandardMaterial({ map: texture })
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