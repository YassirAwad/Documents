import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class Zombie {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player; // Reference to the player
    this.model = null;

    // Each zombie has its own AnimationMixer instance
    this.mixer = null;

    // List of zombie models
    this.skins = [
      '/assets/zombie1.fbx',
      '/assets/zombie2.fbx',
      '/assets/zombie3.fbx',
      '/assets/zombie4.fbx',
      '/assets/zombie5.fbx',
      '/assets/zombie6.fbx',
    ];

    // List of chase animations
    this.chaseAnimations = [
      '/assets/chase1.fbx',
      '/assets/chase2.fbx',
    ];

    // List of attack animations
    this.attackAnimations = [
      '/assets/Attack1.fbx',
      '/assets/Attack2.fbx',
    ];

    // List of idle animations
    this.idleAnimations = [
      '/assets/idle1.fbx',
      '/assets/idle2.fbx',
    ];

    // Current animations
    this.currentChaseAnimation = null;
    this.currentAttackAnimation = null;
    this.currentIdleAnimation = null;

    // Speed of the zombie
    this.speed = 0.05; // Adjust this value to change the speed
    this.attackDistance = 3.0; // Distance at which the zombie will attack
    this.idleDistance = 10.0; // Distance for idle animation

    // Load the model with a random skin
    this.loadModel();
  }

  // Load a random model for the zombie
  loadModel() {
    const loader = new FBXLoader();
    const randomSkin = this.skins[Math.floor(Math.random() * this.skins.length)];

    loader.load(randomSkin, (fbx) => {
      this.model = fbx;
      this.model.scale.set(0.016, 0.016, 0.016);
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.scene.add(this.model);

      // Create a new mixer for this zombie model
      this.mixer = new THREE.AnimationMixer(this.model);

      // Load animations
      this.loadChaseAnimation();
      this.loadAttackAnimation();
      this.loadIdleAnimation();
    }, undefined, (error) => {
      console.error('Error loading zombie model:', error);
    });
  }

  // Load a random chase animation
  loadChaseAnimation() {
    const loader = new FBXLoader();
    const randomChase = this.chaseAnimations[Math.floor(Math.random() * this.chaseAnimations.length)];

    loader.load(randomChase, (fbx) => {
      const actions = fbx.animations;
      if (actions && actions.length > 0) {
        this.currentChaseAnimation = this.mixer.clipAction(actions[0]);
        this.currentChaseAnimation.setLoop(THREE.LoopRepeat);
        console.log(`Loaded chase animation from: ${randomChase}`);
      } else {
        console.error(`No animations found in ${randomChase}`);
      }
    }, undefined, (error) => {
      console.error('Error loading chase animation:', error);
    });
  }

  // Load a random idle animation
  loadIdleAnimation() {
    const loader = new FBXLoader();
    const randomIdle = this.idleAnimations[Math.floor(Math.random() * this.idleAnimations.length)];

    loader.load(randomIdle, (fbx) => {
      const actions = fbx.animations;
      if (actions && actions.length > 0) {
        this.currentIdleAnimation = this.mixer.clipAction(actions[0]);
        this.currentIdleAnimation.setLoop(THREE.LoopRepeat);
        console.log(`Loaded idle animation from: ${randomIdle}`);
      } else {
        console.error(`No animations found in ${randomIdle}`);
      }
    }, undefined, (error) => {
      console.error('Error loading idle animation:', error);
    });
  }

  // Load a random attack animation
  loadAttackAnimation() {
    const loader = new FBXLoader();
    const randomAttack = this.attackAnimations[Math.floor(Math.random() * this.attackAnimations.length)];

    loader.load(randomAttack, (fbx) => {
      const actions = fbx.animations;
      if (actions && actions.length > 0) {
        this.currentAttackAnimation = this.mixer.clipAction(actions[0]);
        this.currentAttackAnimation.setLoop(THREE.LoopRepeat); // Attack should not loop
        this.currentAttackAnimation.clampWhenFinished = true; // Keep the last frame
        console.log(`Loaded attack animation from: ${randomAttack}`);
      } else {
        console.error(`No animations found in ${randomAttack}`);
      }
    }, undefined, (error) => {
      console.error('Error loading attack animation:', error);
    });
  }

  // Update the zombie's position and animations
  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }

    if (this.model && this.player) {
      // Calculate direction towards the player
      const direction = new THREE.Vector3();
      direction.subVectors(this.player.model.position, this.model.position);
      const distance = direction.length();

      // Check distances for animation transitions
      if (distance > this.idleDistance) {
        // If beyond idle distance, play idle animation
        if (this.currentIdleAnimation && !this.currentIdleAnimation.isRunning()) {
          this.currentIdleAnimation.play();
        }
        
        // Ensure other animations stop
        if (this.currentChaseAnimation && this.currentChaseAnimation.isRunning()) {
          this.currentChaseAnimation.stop();
        }
        
        if (this.currentAttackAnimation && this.currentAttackAnimation.isRunning()) {
          this.currentAttackAnimation.stop();
        }
      } else if (distance <= this.idleDistance && distance > this.attackDistance) {
        // If between idle and attack distance, play chase animation
        if (this.currentChaseAnimation && !this.currentChaseAnimation.isRunning()) {
          this.currentChaseAnimation.play();
        }
        
        // Ensure other animations stop
        if (this.currentIdleAnimation && this.currentIdleAnimation.isRunning()) {
          this.currentIdleAnimation.stop();
        }
        
        if (this.currentAttackAnimation && this.currentAttackAnimation.isRunning()) {
          this.currentAttackAnimation.stop();
        }

        // Move towards the player
        direction.normalize();
        this.model.position.add(direction.multiplyScalar(this.speed));
        this.model.lookAt(this.player.model.position);
      } else if (distance <= this.attackDistance) {
         // Ensure other animations stop
         if (this.currentChaseAnimation && this.currentChaseAnimation.isRunning()) {
            this.currentChaseAnimation.stop();
          }
          
          if (this.currentIdleAnimation && this.currentIdleAnimation.isRunning()) {
            this.currentIdleAnimation.stop();
          }
        // If within attack distance, stop other animations and play attack animation
        if (this.currentAttackAnimation && !this.currentAttackAnimation.isRunning()) {
          this.currentAttackAnimation.play();
        }

       
      }
    }
  }
}
