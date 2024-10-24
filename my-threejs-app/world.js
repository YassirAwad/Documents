import * as THREE from 'three';

export function createWorld(scene) {
  const objects = []; // Array to store the created objects

  // Create ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create red cubes
  const objectGeometry = new THREE.BoxGeometry();
  const objectMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

  for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(objectGeometry, objectMaterial);
      cube.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
      cube.castShadow = true;
      scene.add(cube);
      objects.push(cube); // Add the cube to the objects array
  }

  // Add a blue sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(5, 1, -5);
  sphere.castShadow = true;
  scene.add(sphere);
  objects.push(sphere); // Add the sphere to the objects array

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  return objects; // Return the objects array
}
