const controls = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    rotateLeft: false,
    rotateRight: false,
    isThirdPerson: false
  };
  
  function handleKeyDown(event) {
    switch (event.code) {
      case 'KeyW': controls.moveForward = true; break;
      case 'KeyS': controls.moveBackward = true; break;
      case 'KeyA': controls.moveLeft = true; break;
      case 'KeyD': controls.moveRight = true; break;
      case 'ArrowLeft': controls.rotateLeft = true; break;
      case 'ArrowRight': controls.rotateRight = true; break;
      case 'KeyC': controls.isThirdPerson = !controls.isThirdPerson; break; 
    }
  }
  
  function handleKeyUp(event) {
    switch (event.code) {
      case 'KeyW': controls.moveForward = false; break;
      case 'KeyS': controls.moveBackward = false; break;
      case 'KeyA': controls.moveLeft = false; break;
      case 'KeyD': controls.moveRight = false; break;
      case 'ArrowLeft': controls.rotateLeft = false; break;
      case 'ArrowRight': controls.rotateRight = false; break;
    }
  }
  
  function setupKeyControls() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }
  
  // Export controls and setup function
  export { controls, setupKeyControls };
  