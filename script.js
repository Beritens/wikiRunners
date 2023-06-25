
// Set initial position and speed of the ball
var x = window.innerWidth / 2;
var y = window.innerWidth / 2;
var speed = 2; // Speed of the ball
var w = 0
var d =0
var s = 0
var a = 0
vx = 0
vy = 0
var radius = 20;



// Function to update the ball's position based on key input
function moveBall(event) {
  // Move left (A key)
  if (event.keyCode === 65) {
    a = speed;
  }
  // Move up (W key)
  else if (event.keyCode === 87) {
    vy = -5;
  }
  // Move right (D key)
  else if (event.keyCode === 68) {
    d = speed;
  }
  // Move down (S key)
  else if (event.keyCode === 83) {
    s = speed;
  }
}

// Function to stop the ball's movement when keys are released
function stopBall(event) {
    // Move left (A key)
    if (event.keyCode === 65) {
      a = 0;
    }
    // Move right (D key)
    else if (event.keyCode === 68) {
      d = 0;
    }
  }

// Add event listeners for keydown and keyup events
document.addEventListener("keydown", moveBall);
document.addEventListener("keyup", stopBall);
onmousemove = function(e){x=e.clientX
y= e.clientY}
// Function to continuously update and redraw the ball
function animate() {
  //   vy += 0.1
  //   vx = Math.min(Math.max(vx + (d-a - 0.01*vx),-speed),speed)
  // // Update ball position
  //   x += vx
  //   y += vy
    
    ball.style.left = x + "px";
    ball.style.top = y + "px";
    ball.style.backgroundColor = "blue";
    element = document.elementFromPoint(x,y)
    if(element){
      var text = element.childNodes[0].nodeValue
      if(text && text.trim().length > 0){
        ball.style.backgroundColor = "red";
        console.log(text)
      }
    }
    
            
    
  
    requestAnimationFrame(animate);
}

// Start the animation
animate();
