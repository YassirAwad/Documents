export function updatePlayerMovement(avatar, controls) {
    const moveSpeed = 0.1;
    const rotationSpeed = 0.05;
  
    if (avatar.model) {

      if (controls.moveForward) {
        avatar.model.translateZ(+moveSpeed);
        avatar.playAnimation('walk'); 
      }
      if (controls.moveBackward) {
        avatar.model.translateZ(-moveSpeed);
        avatar.playAnimation('back'); 
      }
      if (controls.moveLeft) {
        avatar.model.translateX(+moveSpeed);
        avatar.playAnimation('left'); 
      }
      if (controls.moveRight) {
        avatar.model.translateX(-moveSpeed);
        avatar.playAnimation('right'); 
      }

      if (controls.rotateLeft) {
        avatar.model.rotation.y += rotationSpeed;
      }
      if (controls.rotateRight) {
        avatar.model.rotation.y -= rotationSpeed;
      }
  
      if (!controls.moveForward && !controls.moveBackward && !controls.moveLeft && !controls.moveRight) {
        avatar.playAnimation('idle');
      }
    }
  }
  