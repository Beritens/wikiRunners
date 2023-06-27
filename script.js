
// Set initial position and speed of the ball
var x = window.innerWidth / 2;
var y = 0
var speed = 6; // Speed of the ball
var w = 0
var d =0
var s = 0
var a = 0
vx = 0
vy = 0
var radius = 20;
var grounded = false



function collision(x, y){
 

  element = document.elementFromPoint(x,y)
  if (element instanceof HTMLIFrameElement){
    _element = element.contentWindow.document.elementFromPoint(x, y);  //Not sure if you need to update x, y to account for being inside another dom.
  }
    
  else if(element && element.childNodes[0]){
    var text = element.childNodes[0].nodeValue
    if(text && text.trim().length > 0){
      // Highlight the street and city
      for(let i = 0; i <text.length; i++){
        const range = document.createRange();
        range.setStart(element.childNodes[0], i);
        range.setEnd(element.childNodes[0], i+1);
        var rect = range.getBoundingClientRect()
        if(x>rect.left && x<rect.right && y<rect.bottom && y>rect.top){
          return rect
        }
      }
      
    }
  }
  return false
}
// Function to update the ball's position based on key input
function moveBall(event) {
  // Move left (A key)
  if (event.keyCode === 65) {
    a = speed;
  }
  // Move up (W key)
  else if (event.keyCode === 87) {
    if(grounded){
      vy = -5;
    }
    
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
// onmousemove = function(e){x=e.clientX
// y= e.clientY}
// Function to continuously update and redraw the ball
function animate() {
  
    vy += 0.1
    vx = Math.min(Math.max(vx + (d-a - 0.2*vx),-speed),speed)
  // // Update ball position
    x += vx
    y += vy
    
    ball.style.left = x + "px";
    ball.style.top = y + "px";
    ball.style.backgroundColor = "blue";
    rect = collision(x+20,y+40)
    if(rect){
      grounded = true
      ball.style.backgroundColor = "red";
      y= rect.top-40
      vy = 0
    }
    else{
      grounded = false
    }    
    
  
    requestAnimationFrame(animate);
}

// Start the animation
animate();
