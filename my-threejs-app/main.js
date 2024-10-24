import * as THREE from 'three';
import { createCamera, updateThirdPersonCamera } from './camera.js';
import { createWorld } from './world.js';
import { Avatar } from './avatar.js';
import { updatePlayerMovement } from './playerMovement.js';
import { controls, setupKeyControls } from './keyControls.js'; 

let avatar;
let mixer;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = createCamera();
const objectsInScene = createWorld(scene);

mixer = new THREE.AnimationMixer(scene);
avatar = new Avatar(scene, mixer);



setupKeyControls();

function updateCamera() {
  const headOffset = new THREE.Vector3(0, (avatar.model.scale.y * 1000) / 2, 0);
  const headPosition = avatar.model.position.clone().add(headOffset);

  if (controls.isThirdPerson && avatar.model) {
    updateThirdPersonCamera(camera, avatar.model);
    avatar.model.visible = true; 
  } else if (avatar.model) {
    camera.position.lerp(headPosition, 0.1); 
    const avatarDirection = new THREE.Vector3(0, 0, 1); 
    avatarDirection.applyQuaternion(avatar.model.quaternion); 
    camera.lookAt(headPosition.clone().add(avatarDirection)); 

    avatar.model.visible = false; 
  }
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();

  updatePlayerMovement(avatar, controls); 
  updateCamera();
  avatar.update(deltaTime);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
