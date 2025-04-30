import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let scene, camera, renderer, tower, animationId;
let mouseX = 0, mouseY = 0;

// Preload and set up the scene with only the Stamford Tower model
export function preloadSecondScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x141f24);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(20, 5, 12);
  camera.lookAt(-15, 5, 0); // Initial target

  // Ambient lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 10);
  scene.add(ambientLight);

  // Load the finalized Stamford Tower model
  const loader = new GLTFLoader();
  loader.load(
    'models/stamfordtowerfinalized.glb',
    (gltf) => {
      tower = gltf.scene;
      tower.position.set(5, 0, 0); // Move tower slightly to the right
      scene.add(tower);
    },
    undefined,
    (error) => {
      console.error('Error loading Stamford Tower model:', error);
    }
  );
}

// Initialize renderer and handle resizing
export function finalizeSecondScene() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = 'second-scene';

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Mouse move event for camera panning
  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });
}

// Append renderer to DOM and start animation loop
export function showSecondScene() {
  document.body.appendChild(renderer.domElement);
  animate();
}

// Simple rotation animation for the tower
function animate() {
  animationId = requestAnimationFrame(animate);

  // Slight panning based on mouse position
  const targetX = -15 + mouseX * 5;
  const targetY = 5 + mouseY * 2;

  camera.lookAt(new THREE.Vector3(targetX, targetY, 0));

  if (tower) {
    tower.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}
