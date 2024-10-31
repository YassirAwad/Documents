import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class Avatar {
  constructor(scene) {
    this.scene = scene;
    this.model = null;
    this.animations = {};
    this.currentAction = null; 
    this.mixer = new THREE.AnimationMixer(this.model); // Initialize mixer here

    this.loadModel();
  }

  loadModel() {
    const loader = new FBXLoader();
    
    loader.load('/assets/Remy.fbx', (fbx) => {
      this.model = fbx;
      this.model.scale.set(0.008, 0.008, 0.008); 
      this.model.rotation.y = Math.PI / 2;
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(this.model);

      // Initialize mixer here after model is loaded
      this.mixer = new THREE.AnimationMixer(this.model); // Now mixer is properly assigned

      // Load animations after the model is ready
      this.loadAnimation('/assets/Walk.fbx', 'walk');
      this.loadAnimation('/assets/Idle.fbx', 'idle');
      this.loadAnimation('/assets/BWalk.fbx', 'back');
      this.loadAnimation('/assets/Right.fbx', 'right');
      this.loadAnimation('/assets/Left.fbx', 'left');

      this.playAnimation('idle');
    }, undefined, (error) => {
      console.error(`Error loading model:`, error);
    });
  }

  loadAnimation(path, name) {
    const loader = new FBXLoader();
    loader.load(path, (fbx) => {
      const actions = fbx.animations;
      if (actions && actions.length > 0) {
        const action = this.mixer.clipAction(actions[0]);
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = false;
        this.animations[name] = action;
      } else {
        console.error(`No animations found in ${path}`);
      }
    }, undefined, (error) => {
      console.error(`Error loading animation ${path}:`, error);
    });
  }

  playAnimation(name) {
    if (this.animations[name] && this.currentAction !== this.animations[name]) {
      if (this.currentAction) {
        this.currentAction.fadeOut(0.2);
      }
      this.currentAction = this.animations[name];
      this.currentAction.reset().fadeIn(0.2).play();
    }
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  }
}
