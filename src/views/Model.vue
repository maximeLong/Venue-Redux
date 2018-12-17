<template>
  <div id="model">

    <!-- model viewer and sprite container -->
    <div id="model-viewer"></div>

    <!-- Project Links -->
    <content-box :title="'Additional Content'" v-if="device !== 'mobile'">
      additional content goes here
    </content-box>

  </div>
</template>

<script>
import ContentBox from '../components/ContentBox'
import _ from 'lodash'

const THREE =           window.THREE = require('three');
const OrbitControls =   require("three/examples/js/controls/OrbitControls");
const GLTFLoader =      require('three/examples/js/loaders/GLTFLoader');

export default {
  name: 'model',
  components: {
    ContentBox
  },
  computed: {
    device: function() { return this.$store.state.device },
  },

  data: function(){
    return {
      //three scenes
      camera: {},
      scene: {},
      controls: {},
      renderer: {},

      //three state
      wireframe: false,
      gammaOutput: true,
      exposure: 0.9,
      textureEncoding: 'sRGB',
      ambientIntensity: 1.04,
      ambientColor: 0xFFFFFF,
      directIntensity: 0.22,
      directColor: 0xFFFFFF,
      lights: [],
      content: undefined,
    }
  },

  // -- Call Chain:
  // 1) check if WebGL
  // 2) start THREE scene
  // 3) Load model
  mounted: function() {
    window.addEventListener('resize', this.onWindowResize);
    this.startScene();
  },
  destroyed: function() {
    window.removeEventListener('resize', this.onWindowResize);
    if (!_.isEmpty(this.renderer)) {
      this.renderer.forceContextLoss();
      this.renderer.context = null;
      this.renderer.domElement = null;
      this.renderer = null;
      cancelAnimationFrame( this.animate );
    }
  },

  methods: {

    load: function() {
      return new Promise((resolve, reject) => {

        //get model from firebase
        firebase.storage().ref('models/' + this.$store.state.user.uid + '/scene.glb').getDownloadURL()
        .then((url)=> {

          const loader = new THREE.GLTFLoader();
          loader.load(url, (gltf) => {

            const scene = gltf.scene || gltf.scenes[0];
            this.scene.add(scene);

            scene.updateMatrixWorld();
            const box = new THREE.Box3().setFromObject(scene);
            const size = box.getSize().length();
            const center = box.getCenter();

            this.controls.reset();
            scene.position.x += (scene.position.x - center.x);
            scene.position.y += (scene.position.y - center.y);
            scene.position.z += (scene.position.z - center.z);
            this.controls.maxDistance = size * 10;
            this.camera.position.copy(center);
            this.camera.position.x += size / 2.0;
            this.camera.position.y += size / 5.0;
            this.camera.position.z += size / 2.0;
            this.camera.near = size / 100;
            this.camera.far = size * 100;
            this.camera.updateProjectionMatrix();
            this.camera.lookAt(center);
            this.controls.saveState();

            //add lights and material
            this.updateLights();
            this.updateTextureEncoding(scene);
            this.content = scene;

            resolve();

          }, undefined, reject);

        }).catch(function(error) {
          reject(error)
        });

      });
    },

    //three js scene and model loader
    startScene: function() {
      var container = document.getElementById( 'model-viewer' );
      var containerHeight = getComputedStyle(container).height.slice(0, -2);
      var containerWidth = getComputedStyle(container).width.slice(0, -2);

      //create scene and camera
      this.camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 5000 );
      this.scene = new THREE.Scene();

      //render loop -- and add to container
      //TODO: have only one renderer in app, have to mutate renderer
      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true
      });
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( containerWidth, containerHeight );
      this.renderer.gammaOutput = this.gammaOutput;
      container.appendChild( this.renderer.domElement );

      // controls, camera
      this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
      this.controls.target.set( 0, 12, 0 );
      this.camera.position.set( 2, 18, 28 );
      this.controls.update();

      //run loop + watch for resize
      this.animate();
      this.load()
        .then(()=> {
        })
        .catch((error) => {
          window.alert((error||{}).message || error);
        });
    },

    updateTextureEncoding: function(content) {
      const encoding = this.textureEncoding === 'sRGB'
        ? THREE.sRGBEncoding
        : THREE.LinearEncoding;
      content.traverse((node) => {
        if (node.isMesh) {
          const material = node.material;
          if (material.map) material.map.encoding = encoding;
          if (material.emissiveMap) material.emissiveMap.encoding = encoding;
          if (material.map || material.emissiveMap) material.needsUpdate = true;
        }
      });
    },
    updateLights: function() {
      const lights = this.lights;
      this.addLights();
      this.renderer.toneMappingExposure = this.exposure;
      if (lights.length) {
        lights[0].intensity = this.ambientIntensity;
        lights[0].color.setHex(this.ambientColor);
        lights[1].intensity = this.directIntensity;
        lights[1].color.setHex(this.directColor);
      }
    },
    addLights: function() {
      const light1  = new THREE.AmbientLight(this.ambientColor, this.ambientIntensity);
      light1.name = 'ambient_light';
      this.scene.add( light1 );
      const light2  = new THREE.DirectionalLight(this.directColor, this.directIntensity);
      light2.position.set(0.5, 0, 0.866); // ~60º
      light2.name = 'main_light';
      this.scene.add( light2 );
      this.lights.push(light1, light2);
    },

    //three render functions
    animate: function() {
      if (this.renderer === null) {
        cancelAnimationFrame( this.animate );
      } else {
        requestAnimationFrame( this.animate );

        this.controls.update();
        this.render();
      }
    },
    render: function() {
      this.renderer.render( this.scene, this.camera );
    },

    onWindowResize: function(container) {
      var container = document.getElementById( 'model-viewer' );
      var containerHeight = getComputedStyle(container).height.slice(0, -2);
      var containerWidth = getComputedStyle(container).width.slice(0, -2);
      if (!_.isEmpty(this.renderer)) {
        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( containerWidth, containerHeight );
      }
		}

  }

}
</script>

<style lang="sass">
@import src/styles/main

#model
  height: 100%
  width: 100%
  padding: 20px
  +flexbox
  +flex-direction(row)
  +screen(mobile)
    padding: 10px
  #model-viewer
    +flex(1 0 0)
    background: radial-gradient(#f1e4d1 0%, #737373 100%)
    border-radius: 2px
    position: relative
    overflow: hidden
    user-select: none

  .content-box
    width: 350px
    margin-left: 20px
    position: relative
    .content-header
      height: 50px
    .content-content
      overflow-y: scroll
      height: calc(100% - 50px)





</style>
