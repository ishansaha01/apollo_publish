import * as THREE from 'three';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth*.99 / (window.innerHeight*.8), 0.1, 100 );
scene.add( camera );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth*.99, window.innerHeight*.8);
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );


var points = [];

const line = new MeshLine();
line.setPoints(points, p => 0.01);
const material = new MeshLineMaterial;
const mesh = new THREE.Mesh(line, material);
scene.add(mesh);



const moonGeo = new THREE.SphereGeometry( 0.05, 60, 60 );
const moonText = new THREE.TextureLoader().load("lroc_color_poles_1k.jpg");
moonText.colorSpace = THREE.SRGBColorSpace;
const moonMat = new THREE.MeshBasicMaterial( { map:moonText } );
const moon = new THREE.Mesh( moonGeo, moonMat );
scene.add( moon );
moon.position.set(.07, 0, 0);

const earthGeo = new THREE.SphereGeometry( .15, 60, 60 );
const earthText = new THREE.TextureLoader().load("earth_texture.jpg");
earthText.colorSpace = THREE.SRGBColorSpace;
const earthMat = new THREE.MeshBasicMaterial( { map:earthText } );
const earth = new THREE.Mesh( earthGeo, earthMat );
scene.add( earth );
earth.position.set(2, 0, 0);

var light = new THREE.AmbientLight( 0x888888 );
scene.add( light );




//Code for creating the points of travel by orbit
var r;
//Earth Orbit, first 400
for (let j = 0; j < 2.5*Math.PI; j += ( Math.PI) / 200) {
  points.push(.25*Math.cos(j)+2, 0, .25*Math.sin(j));
}
//TLI Orbit
for (let j = 2; j > .102; j -= .01) {
  points.push(j, 0, 1/2.8 * Math.sin(.9*j) - 0.095);
}
//Moon Orbit
for (let j = 3.5*Math.PI; j > 1.5*Math.PI; j -= ( Math.PI) / 200) {
  points.push(.07*Math.cos(j)+.07, 0, .07*Math.sin(j));
}
line.setPoints(points, p => 0.005);
camera.position.y = 1;
camera.position.x = 1;
camera.position.z = 1;


var a = 0;
let reqAnim
var requestId;
function IDLE(){
    renderer.render( scene, camera );
    reqAnim = window.requestAnimationFrame( IDLE);
}

function earthOrbit() {
    cancelAnimationFrame(reqAnim);
    renderer.render( scene, camera );
    line.setPoints(points.slice(0, a), p => 0.005);
    a = a+2;
    if (a >1200){
    a = 0;
    }
    reqAnim = window.requestAnimationFrame( earthOrbit );
}

function TLIOrbit() {
    cancelAnimationFrame(reqAnim);
    renderer.render( scene, camera );
    line.setPoints(points.slice(0, a+1200), p => 0.005);
    a = a+2;
    if (a >900){
    a = 0;
    }
    reqAnim = window.requestAnimationFrame( TLIOrbit );
}

function moonOrbit() {
    cancelAnimationFrame(reqAnim);
    renderer.render( scene, camera );
    line.setPoints(points.slice(0, a+2100), p => 0.005);
    a = a+2;
    if (a >1200){
    a = 0;
    }
    reqAnim = window.requestAnimationFrame( moonOrbit );
}


function earthView(){
  camera.position.set(2.25, .20, .20);
  camera.lookAt(2,0,0);

}

function moonView(){
  camera.position.set(-.1, .1, 0.02);
  camera.lookAt(0,0.05,0);

}

function topView(){
  camera.position.set(0.7, 1.5, 0);
  camera.lookAt(1, 0, 0);
    
}


IDLE();

document.getElementById("earth").addEventListener("click", earthOrbit);
document.getElementById("tli").addEventListener("click", TLIOrbit);
document.getElementById("moon").addEventListener("click", moonOrbit);
"                      "
document.getElementById("earth-view").addEventListener("click", earthView);
document.getElementById("moon-view").addEventListener("click", moonView);
document.getElementById("top-view").addEventListener("click", topView);