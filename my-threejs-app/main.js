import * as THREE from 'three';
import { createCamera, updateThirdPersonCamera } from './camera.js';
import { createWorld } from './world.js';
import { Avatar } from './avatar.js';
import { updatePlayerMovement } from './playerMovement.js';
import { controls, setupKeyControls } from './keyControls.js'; 
import { Zombie } from './Zombie.js';

let avatar;
let zombies = [];

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = createCamera();
const objectsInScene = createWorld(scene);

avatar = new Avatar(scene); // Create the avatar

// Create zombies and pass the avatar to each one
for (let i = 0; i < 1; i++) {
  const zombie = new Zombie(scene, avatar); // Pass avatar as the player reference
  zombies.push(zombie);
}

setupKeyControls();

function updateCamera() {
  const headOffset = new THREE.Vector3(0, (avatar.model.scale.y * 1000) / 3.5, 0);
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
  
  // Update each zombie
  zombies.forEach(zombie => zombie.update(deltaTime));
  
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
