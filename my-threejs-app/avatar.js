import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class Avatar {
  constructor(scene, mixer) {
    this.scene = scene;
    this.mixer = mixer; 
    this.model = null;
    this.animations = {}; 

    this.currentAction = null; 

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


      this.loadAnimation('/assets/Walk.fbx', 'walk');
      this.loadAnimation('/assets/Idle.fbx', 'idle');
      this.loadAnimation('/assets/BWalk.fbx', 'back');
      this.loadAnimation('/assets/Right.fbx', 'right');
      this.loadAnimation('/assets/Left.fbx', 'left');

 
      this.playAnimation('idle');
    });
  }

  loadAnimation(path, name) {
    const loader = new FBXLoader();
    loader.load(path, (anim) => {
      const action = this.mixer.clipAction(anim.animations[0]);
      action.setLoop(THREE.LoopRepeat); 
      action.clampWhenFinished = false;  
      this.animations[name] = action;
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
