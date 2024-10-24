import * as THREE from 'three';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.6, 5);
  return camera;
}

export function updateThirdPersonCamera(camera, target) {
  const offset = new THREE.Vector3(0, 3, -5); 
  offset.applyQuaternion(target.quaternion); 
  camera.position.copy(target.position).add(offset); 
  camera.lookAt(target.position); 
}
