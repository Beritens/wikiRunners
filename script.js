
// Set initial position and speed of the player
var x = window.innerWidth / 2;
var y = 0
var speed = 6; // Speed of the player
var w = 0
var d =0
var s = 0
var a = 0
vx = 0
vy = 0
var radius = 20;
var grounded = false




function collision(x, y, checkLink = false){
 

  element = document.elementFromPoint(x,y)
  if(element){
    
    for(let j = 0; j<element.childNodes.length; j++){
      node = element.childNodes[j]
      if(node){
        var text = node.nodeValue
        if(text && text.trim().length > 0){
          //THIS IS CRAP
          //THIS CAN BE DONE WAY BETTER
          //CONSIDER BAKING THE COLLISION BOUNDS -> blazingly fast
          //when the window size or aspect ratio is changed it would have to be done again, still worth it probably
          //or binary search oder so verwenden. vielleicht sogar noch besser, weil man ja mit der enfernung eine art heuristic hat, wo der character sein könnte.
          let low = 0;
          let high = text.length - 1;
          let count = 0
          while (low <= high) {
            count += 1;
            const mid = (low + high) >> 1; // Bitwise right shift to find the middle index

            const range = document.createRange();
            range.setStart(node, mid);
            range.setEnd(node, mid + 1);
            const rect = range.getBoundingClientRect();
            const rectTop = rect.top;
            const rectLeft = rect.left;
            const rectBottom = rect.bottom;
            const rectRight = rect.right;

            const isIndexHigh = (y < rectTop) || ((x < rectLeft) & (y < rectBottom));
            const isIndexLow = (y > rectBottom) || ((x > rectRight) & (y > rectTop));

            if (!isIndexHigh && !isIndexLow) {
              if (checkLink) {
                if (element.tagName === 'A') {
                  return [rect, element];
                }
                return [rect, false];
              }
              return rect;
            } else if (isIndexHigh) {
              high = mid - 1;
            } else {
              low = mid + 1;
            }
          }

          
        }
      }
      
    }
  }
  if(checkLink){
    
    return[false,false]
  }
  return false
}
// Function to update the player's position based on key input
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

// Function to stop the player's movement when keys are released
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
$(document).on("keydown", moveBall);
$(document).on("keyup", stopBall);
// onmousemove = function(e){x=e.clientX
// y= e.clientY}
// Function to continuously update and redraw the player
function animate() {
  
    vy += 0.1
    vx = Math.min(Math.max(vx + (d-a - 0.2*vx),-speed),speed)
  // // Update player position
    x += vx;
    y += vy;
    
    
    $("#player").css({
      left: x + "px",
      top: (window.innerHeight/2) + "px",
      backgroundColor: "blue",
    });
    $('#wiki-wrapper').css({
      top: -y+(window.innerHeight/2) + "px"
    }); 
    
    [rect, link] = collision(x+20,40+(window.innerHeight/2), true)
    if(link){
      linkText = link.getAttribute('href')
      if(linkText.startsWith("/wiki/")){
        $("#page").empty()
        fetchWikiExtract(linkText.slice(6))
      }
    }
    if(rect){
      grounded = true
      player.style.backgroundColor = "red";
      y -= ((window.innerHeight/2)+40)-rect.top
      vy = 0
    }
    else{
      grounded = false
    }   

    
    
  
    requestAnimationFrame(animate);
}

// Start the animation
animate();


function fetchWikiExtract(page){
    $.getJSON(
      
      "https://en.wikipedia.org/w/api.php?action=parse&prop=text&page="+page+"&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*",
      function(data) {
        x = window.innerWidth / 2;
        y = 0
        console.log(data.parse.text["*"])
        // Extract the HTML content from the response
      var htmlContent = data.parse.text["*"].replaceAll('src="//','src="https://');

      // Find the target element on your page where you want to insert the content
      var $targetElement = $("#page");

      // Set the retrieved HTML as the content of the target element
      $targetElement.html(htmlContent);
      }
      
    );
}

fetchWikiExtract("Platform game");