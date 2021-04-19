import './imports/iro.min.js'
import * as THREE from './imports/three.module.js'
import { GLTFLoader } from './imports/GLTFLoader.js'
import { OrbitControls } from './imports/OrbitControls.js'

// Canvas
const canvas = document.getElementById("demo")
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

//Initial Width and Height
var pixelRatio = window.devicePixelRatio;
var width  = canvas.clientWidth  * pixelRatio | 0;
var height = canvas.clientHeight * pixelRatio | 0;

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x292929 );
//scene.fog = new THREE.Fog( 0x292929, 100, 500 ); //Add this if you're gonna use OrbitControls

//Floor
const floorMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x999999,                    //Color of the material
    emissive: 0x292929,                 //Solid color unaffected by other lighting. Default is black.
    emissiveIntensity: 1,  
    side: THREE.DoubleSide
});
const floorGeometry = new THREE.PlaneGeometry( 500, 500 );
const floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
floorMesh.receiveShadow = true;
floorMesh.rotation.x = - Math.PI / 2.0;     //Places the floor horizontally
scene.add( floorMesh );

//Lights
function createSpotlight( color ) {
    const newObj = new THREE.SpotLight( color, 2 );
    newObj.intensity = 1;
    newObj.castShadow = true;
    newObj.angle = (Math.PI / 7.25);
    newObj.penumbra = 0.2;
    newObj.decay = 1;
    newObj.distance = 500;

    return newObj;
}

const spotLightRight = createSpotlight( 0xFF7F00 );
const spotLightLeft = createSpotlight( 0x00FF7F );
const spotLightBack = createSpotlight( 0x7F00FF );

spotLightRight.position.set(40, 80, 25);
spotLightLeft.position.set(-40, 80, 25);
spotLightBack.position.set(0, 80, -40);

scene.add(spotLightRight);
scene.add(spotLightLeft);
scene.add(spotLightBack);

scene.add(spotLightRight.target);
scene.add(spotLightLeft.target);
scene.add(spotLightBack.target);

//Model Loading
var manager = new THREE.LoadingManager();

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    //Start
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
    //Complete
    //Removes Loading Screen
    document.getElementById("loading-container").remove();
    console.log( 'Loading complete!');
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    //Progress
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
    //Error
    console.log( 'There was an error loading ' + url );
};

//GLTF Model Loader
var loader = new GLTFLoader( manager );
loader.load("./models/Francois_Willeme.glb", function(gltf){
    var model = gltf.scene;
    var newMaterial = new THREE.MeshPhongMaterial({
        color: 0xe6e2ca,                    //Color of the material
        emissive: 0x2a2a2a,                 //Solid color unaffected by other lighting. Default is black.
        emissiveIntensity: 0.9,  
        side: THREE.DoubleSide
    });
    model.traverse(function (child) {
         if (child.isMesh) {
            child.material = newMaterial;   //Applies the new material to the model
            child.castShadow = true;        //Updates the mesh to cast shadows
        }
    });
    model.rotation.y = -2.5;                //Rotate to face the camera
    model.position.y = 18;
    model.scale.set(0.125, 0.125, 0.125);   //Resize the model
    scene.add(model);
})

//Perspective Camera (Like Human Eyes)
var fov = 50;
var aspect = width / height;
const camera = new THREE.PerspectiveCamera(fov, aspect);
camera.position.set(0, 45, 90);
camera.rotation.x = -20 * Math.PI / 180;


//Orbit Controls
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true


//Renderer (Resizing)
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    pixelRatio = window.devicePixelRatio;
    width  = canvas.clientWidth  * pixelRatio | 0;
    height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    //Update Renderer
    renderer.render(scene, camera);

    //Update Orbital Controls
    //controls.update()

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

// Box & hue sliders

//boxPicker Right
var boxPickerRight = new iro.ColorPicker("#boxPickerRight", {
    width: 125,
    color: "rgb(255, 0, 0)",
    borderWidth: 2,
    borderColor: "#000000",
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'hue'
        }
      }
    ]
  });

  boxPickerRight.on('color:change', function(color) {
    spotLightRight.color.set(color.hexString);
  })


  //boxPicker Left
  var boxPickerLeft = new iro.ColorPicker("#boxPickerLeft", {
    width: 125,
    color: "rgb(255, 0, 0)",
    borderWidth: 2,
    borderColor: "#000000",
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'hue'
        }
      }
    ]
  });

  boxPickerLeft.on('color:change', function(color) {
    spotLightLeft.color.set(color.hexString);
  })

  //boxPicker Back
  var boxPickerBack = new iro.ColorPicker("#boxPickerBack", {
    width: 125,
    color: "rgb(255, 0, 0)",
    borderWidth: 2,
    borderColor: "#000000",
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'hue'
        }
      }
    ]
  });

  boxPickerBack.on('color:change', function(color) {
    spotLightBack.color.set(color.hexString);
  })