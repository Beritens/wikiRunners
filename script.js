
// Set initial position and speed of the player
var x = window.innerWidth / 2;
var y = -0
var speed = 0.24; // Speed of the player
var lockVel = false;

//keysPressed
var w = 0;
var d =0;
var a = 0;
var shift = false;
var dig = false;

vx = 0;
vy = 0;

let grappleX=0;
let grappleY=0;
let grapple = false;


const playerHeight = 40;
const playerWidth = 40;
var grounded = false
const runloop= [0,1,2,3]
const jumploop= [4,5,6,7,8,9,10]
const slideFrame = "./assets/Run anim/run0.png"
var preloadedImages = [];


var inGame = false;

let $playerSprite;
let $line;
let $wikiWrapper;
let $player;
let $page;

$( document ).ready(function() {
  $playerSprite = $("#playerSprite");
  $line = $("#line");
  $wikiWrapper = $('#wiki-wrapper');
  $player = $("#player");
  $page = $("#page");
});

// Function to preload images
function preloadImages(imagePaths) {
  for (var i = 0; i < imagePaths.length; i++) {
    var img = new Image();
    img.src = imagePaths[i];
    preloadedImages.push(img);
  }
}
var imagePaths = [
  './assets/Run anim/run0.png',
  './assets/Run anim/run1.png',
  './assets/Run anim/run2.png',
  './assets/Run anim/run3.png',
  './assets/Run anim/run4.png',
  './assets/Run anim/run5.png',
  './assets/Run anim/run6.png',
  './assets/Run anim/run7.png',
  './assets/Run anim/run8.png',
  './assets/Run anim/run9.png',
  './assets/Run anim/run10.png',
  './assets/Run anim/run11.png',
  './assets/Run anim/run12.png',
  './assets/Run anim/run13.png'
  // Add more image paths if needed
];
preloadImages(imagePaths);


//x doesn't really matter screenPosition = worldPosition
function screenToWorldY(sy){
  return y-(window.innerHeight/2) + sy;
}

function woroldToScreenY(wy){
  return wy-y+window.innerHeight/2

}


//uses screen position
function collision(x, y, player = false){
 

  elements = document.elementsFromPoint(x,y)
  
  for(element of elements){
    if(element && element.childNodes){
      
      for(let j = 0; j<element.childNodes.length; j++){
        node = element.childNodes[j]
        if(node){
          var text = node.nodeValue
          if(text && text.trim().length > 0){
            //using bitwise search to get the correct character
            //this could still be imporved a lot but it's fine for now
            let high = text.length - 1;
            let low= 0
            while (low <= high) {
              
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
                if (player) {
                  if(text.charAt(mid) == "\u2002" ){
                    return [false,false, null, 0];
                  }
                  else if (element.tagName === 'A') {
                    return [rect, element, node, mid];
                  }
                  return [rect, false, node, mid];
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
  }
  
  if(player){
    
    return[false,false, null, 0]
  }
  return false
}
// Function to update the player's position based on key input
function keyDown(event) {

  // Move left (A key)
  if (event.keyCode === 65) {
    a = 1;
  }
  // Move up (W key)
  else if (event.keyCode === 87) {
    //jump
    if(grounded){
      frame = 0
      vy = -0.5;
    }
    
  }
  // Move right (D key)
  else if (event.keyCode === 68) {
    d = 1;
  }
  else if (event.keyCode === 16) {
    shift = true
  }
  else if (event.keyCode === 83) {
    dig = true
  }
}

// Function to stop the player's movement when keys are released
function keyUp(event) {
    // Move left (A key)
    if (event.keyCode === 65) {
      a = 0;
    }
    // Move right (D key)
    else if (event.keyCode === 68) {
      d = 0;
    }
    else if (event.keyCode === 16) {
      shift = false
      lockVel=false
    }
    else if (event.keyCode === 83) {
      dig = false
    }
  }

// Add event listeners for keydown and keyup events
$(document).on("keydown", keyDown);
$(document).on("keyup", keyUp);
var lastTime;
var elapsedSinceLastLoop;
onmousedown = function(e){
  if(collision(e.clientX ,e.clientY)){
    grapple = true
    grappleX=e.clientX 
    grappleY= screenToWorldY(e.clientY)
  }
  else{
    for(let i = 1; i < 60; i++){
      fx = Math.cos(i*2.39996322972865332);
      fy = Math.sin(i*2.39996322972865332);
      if(collision(e.clientX+ fx*i*5 ,e.clientY+ fy * i* 5)){
        grapple = true;
        grappleX=e.clientX + fx*i*1;
        grappleY= screenToWorldY(e.clientY)+ fy * i* 5;
        return;
      }
    }
  }
  }
  onmouseup = function(e){
    grapple=false
  }
// Function to continuously update and redraw the player
let frame = 0;
function turn(){
  if(vx !== 0){
    $playerSprite.css({
      transform: `scaleX(${Math.sign(vx)})`
    })
  }
}
function animate(){
  if(lockVel){
    $playerSprite.attr("src",slideFrame);
    return;
  }
  if(grounded){
    if(vx*vx > 0.0001){
      frame = (frame + elapsedSinceLastLoop*0.02) % 4;
      animImg = `./assets/Run anim/run${runloop[Math.floor(frame)]}.png`;
    }else{
      animImg = `./assets/Run anim/run0.png`;
    }
  }
  else{
    
    frame = (frame + elapsedSinceLastLoop*0.01);
    animImg = `./assets/Run anim/run${jumploop[Math.min(Math.floor(frame),5)]}.png`;
  }
  $playerSprite.attr("src",animImg);
  
}
function shiftSpeed(){
  if(shift && grounded && !lockVel && (-a+d)!==0){
    lockVel = true;
    vx = (Math.abs(vx)+Math.abs(vy))* Math.sign(-a+d)
  }

}
function shiftTurn(){
  if(shift && lockVel && (-a+d !== 0) && !grapple){
    vx = Math.abs(vx)* Math.sign(-a+d)
  }
}
function grappleLine(){
  if(!grapple){
    $line.css({
    
      visibility: "hidden"
      
      
    })
    return;
  }
  disY =  woroldToScreenY(grappleY)
 
  middleY = (disY + window.innerHeight/2+playerHeight/2)/2

  dirX = grappleX-(x+playerWidth/2);
  dirY = window.innerHeight/2+playerHeight/2 -disY;
  ang = Math.atan(dirY/dirX);
  norm = Math.sqrt(dirX*dirX + dirY*dirY);
  posX = ((x+playerWidth/2 + grappleX)/2)-norm/2
  $line.css({
    
    transform: `rotate(${-ang}rad)`,
    left: posX + "px",
    top: middleY+ "px",
    width:  norm+  "px",
    visibility: "visible"
    
  })
}
function move(elapsedSinceLastLoop){
  vy += 0.001*elapsedSinceLastLoop;
    if(!lockVel && !grapple && (grounded || controlled || (d-a !== 0)) ){
      controlled= true
      if(d-a === 0){
        vx *= Math.pow(0.9,elapsedSinceLastLoop);
      }
      else{
        nvx = (d-a)*speed;
      if(vx/nvx<1){
        vx = nvx
      }
      }
      
      //vx = Math.min(Math.max(vx + (d-a - 0.2*vx),-speed),speed);
    }
    else if(d-a!==0  && grapple && !lockVel){
      if(vx/((d-a)*speed) <1){
        vx+= (d-a)*speed*elapsedSinceLastLoop*0.001
      }
      //vx *= Math.pow(0.9,elapsedSinceLastLoop);
    }
    
}
function grapplePhy(elapsedSinceLastLoop) {
  if(grapple){
    controlled= false;
    diffX = grappleX-x;
    diffY= grappleY-y
    norm = Math.sqrt(diffX*diffX + diffY * diffY);
    diffX = diffX/norm;
    diffY = diffY/norm;

    nx = x + dx;
    ny = y + dy;

    diffnX = grappleX-nx;
    diffnY= grappleY-ny
    nnorm = Math.sqrt(diffnX*diffnX + diffnY * diffnY);

    delta = norm-nnorm;
    if(delta < 0.05*elapsedSinceLastLoop){
      vx += diffX*elapsedSinceLastLoop*0.01
      vy += diffY*elapsedSinceLastLoop*0.01
    }
  }
}
function mod(n, m) {
  return ((n % m) + m) % m;
}

function loopAround () {

  x = mod(x,window.innerWidth);
  y = mod((y+window.innerHeight),($wikiWrapper.height() + window.innerHeight*2 ))- window.innerHeight;
}

controlled = true;
function update(currentTime) {
  if(!inGame){
    return;
  }
  if(!lastTime){lastTime=currentTime; requestAnimationFrame(update); return;}
  elapsedSinceLastLoop=(currentTime-lastTime);
  
    
    move(elapsedSinceLastLoop)
  // // Update player position
    dx = vx*elapsedSinceLastLoop
    dy = vy*elapsedSinceLastLoop
    
    grapplePhy(elapsedSinceLastLoop)
    

    dx = vx*elapsedSinceLastLoop
    dy = vy*elapsedSinceLastLoop
    
    x += dx;
    y += dy;
    
    
    
    
    [rect, link, node, chIndex] = collision(x+playerWidth/2,playerHeight+(window.innerHeight/2)+dy, true)

    
    if(rect){
      if(node && dig){
        impact(node,chIndex, Math.max(1,Math.min(vy*10,8)));
        vy = vy*0.8;
        
      }
      else if(link && !shift){
        linkText = link.getAttribute('href');
        if(linkText.startsWith("/wiki/")){
          $page.empty();
          fetchWikiExtract(linkText.slice(6));
        }
      }
      else{
        grounded = true;
        y -= (playerHeight+(window.innerHeight/2)+dy)-rect.top;
        shiftSpeed();
        vy = 0;
      }
    }
    else{
      shiftTurn();
      grounded = false;
    }   

    $player.css({
      transform: `translateY(${(window.innerHeight/2)}px) translateX(${x}px)`
    });
    $wikiWrapper[0].style.transform = `translateY(${-y+(window.innerHeight/2)}px)`; 
    
    lastTime=currentTime;
    animate();
    turn();
    grappleLine();
    loopAround()
    requestAnimationFrame(update);
}





function startGame(start, stop){
  fetchWikiExtract(encodeURI(start));
  $('#fromText').text(start);
  $('#toText').text(stop);
  inGame = true;
  update();
  $("#game").css({
    display: `block`
    // top: -y+(window.innerHeight/2) + "px"
  }); 
  $("#menu").css({
    display: `none`
    // top: -y+(window.innerHeight/2) + "px"
  }); 
}
