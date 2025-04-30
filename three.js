// three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  preloadSecondScene,
  finalizeSecondScene,
  showSecondScene
} from 'secondthree.js';

let clickCount = 0;
let currentRenderer = null;
// ← re-declare the animation handle so cleanup() can cancel it
let currentAnimationId = null;

// Preload the second scene on page load
document.addEventListener('DOMContentLoaded', () => {
  preloadSecondScene();
});

// Switch between first and second scene on clicks
document.addEventListener('click', () => {
  clickCount += 1;

  if (clickCount === 1) {
    initFirstScene();
  } else if (clickCount === 2) {
    // trigger fade-out of the first scene
    if (window.firstScene) {
      window.firstScene.startFadeOut = true;
      setTimeout(() => {
        document.getElementById('map').style.display = 'none';
    }, 499);
    }

    

    // prepare and then show the second scene
    finalizeSecondScene();
    setTimeout(showSecondScene, 500);
  }
});

function initFirstScene() {
  const scene = new THREE.Scene();
  window.firstScene = { scene, startFadeOut: false };

  // overhead camera
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 15, 0);
  camera.lookAt(0, 0, 0);

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x141f24);
  renderer.domElement.id = 'map';
  document.body.appendChild(renderer.domElement);
  window.firstScene.renderer = renderer;
  currentRenderer = renderer;

  // lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5, 10, 7.5);
  scene.add(dir);

  // group for models
  const group = new THREE.Group();
  scene.add(group);

  const loader = new GLTFLoader();
  let statesModel = null;
  let mapModel = null;

  // load states
  loader.load('models/states.glb', (gltf) => {
    const m = gltf.scene;
    m.scale.set(1, 0.5, 1);
    m.traverse(c => {
      if (c.isMesh) {
        c.material = new THREE.MeshStandardMaterial({
          map: c.material.map,
          color: 0x38464f,
          emissive: 0x38464f,
          transparent: true,
          opacity: 0
        });
      }
    });
    statesModel = m;
    group.add(m);
  });

  // load map
  loader.load('models/us_map.glb', (gltf) => {
    const m = gltf.scene;
    m.scale.set(1, 0.1, 1);
    m.userData.originalY = m.position.y;
    m.traverse(c => {
      if (c.isMesh) {
        c.material = new THREE.MeshStandardMaterial({
          map: c.material.map,
          color: 0x38464f,
          transparent: true,
          opacity: 0
        });
      }
    });
    mapModel = m;
    group.add(m);
  });

  // mouse interaction
  let mouseX = 0, mouseY = 0;
  const onMouse = e => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  document.addEventListener('mousemove', onMouse);
  window.firstScene.mouseHandler = onMouse;

  // timing constants
  const fadeDelay = 2500, fadeDuration = 300;
  const statesAnimDuration = 10000;
  const mapSinkDelay = 5000, mapSinkDuration = 2000;
  const fadeOutDuration = 1000;

  let sceneStart = performance.now();
  let fadeStart = null, statesStart = null, sinkStart = null;
  let fadeOutStart = null;

  function animate(now) {
    // ← store the handle for cleanup()
    currentAnimationId = requestAnimationFrame(animate);

    // fade-out logic
    if (window.firstScene.startFadeOut) {
      if (!fadeOutStart) fadeOutStart = now;
      let p = (now - fadeOutStart) / fadeOutDuration;
      if (p >= 1) { cleanup(); return; }
      const op = 1 - p;
      renderer.setClearColor(new THREE.Color(0x141f24).lerp(new THREE.Color(0x000000), p), op);
      [statesModel, mapModel].forEach(mod => {
        if (mod) mod.traverse(c => c.isMesh && (c.material.opacity = op));
      });
      return;
    }

    // fade-in
    let elapsed = now - sceneStart;
    if (elapsed > fadeDelay && !fadeStart) fadeStart = now;
    if (fadeStart) {
      let prog = Math.min((now - fadeStart) / fadeDuration, 1);
      [statesModel, mapModel].forEach(mod => {
        if (mod) mod.traverse(c => c.isMesh && (c.material.opacity = prog));
      });
      if (prog === 1 && !statesStart) statesStart = now;
    }

    // states scale/color
    if (statesStart && statesModel) {
      let t = Math.min((now - statesStart) / statesAnimDuration, 1);
      statesModel.scale.y = 0.1 + (1.5 - 0.1) * t;
      const col = new THREE.Color(0x00ff88).multiplyScalar(t);
      statesModel.traverse(c => c.isMesh && (c.material.color.copy(col), c.material.emissive.copy(col)));
    }

    // map sink
    if (elapsed > mapSinkDelay && !sinkStart) sinkStart = now;
    if (sinkStart && mapModel) {
      let sp = Math.min((now - sinkStart) / mapSinkDuration, 1);
      const ease = 1 - Math.pow(1 - sp, 3);
      mapModel.position.y = mapModel.userData.originalY - 1 * ease;
    }

    // mouse tilt
    group.rotation.y = mouseX * 0.25;
    group.rotation.x = mouseY * 0.6;

    renderer.render(scene, camera);
  }

  animate(performance.now());

  function cleanup() {
    cancelAnimationFrame(currentAnimationId);
    document.removeEventListener('mousemove', window.firstScene.mouseHandler);
    window.removeEventListener('resize', window.firstScene.resizeHandler);
    renderer.domElement.remove();
    renderer.dispose();
    window.firstScene = null;
  }

  // resize handler
  const onResize = () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };
  window.addEventListener('resize', onResize);
  window.firstScene.resizeHandler = onResize;
}
