/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com

1.	Add sound effects to the game (not just a theme, but noises that happen with events).
2.	Add more random enemies (more sprites) (lots of sprites on the web, search!)
3.	Add wall/edge detection to keep the player on the canvas
4.	Add high scores
5.	Add obstacles/mazes
6.	animated sprites

*/
// Create the canvas for the game to display in
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
// set the canvas size
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas); // inject this new element intot the DOM

// load sound
var snd = new Audio("whack.wav"); // buffers automatically when created,  http://soundbible.com/tags-short.html

// load images, use the onload event so we can later wait for images to be there
// Load the background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () { 
  // show the background image
  bgReady = true;
};
bgImage.src = "images/snow.jpg";
// Load the hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  // show the here image
  heroReady = true;
};
heroImage.src = "images/penquin.jpg";

// Load the monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
  // show the monster image
  monsterReady = true;
};
monsterImage.src = "images/fish1.jpg";

// Load the tree image
var treeReady = false;
var treeImage = new Image();
treeImage.onload = function () {
  // show the treee image
  treeReady = true;
};
treeImage.src = "images/trees2.jpg";  // 50 by 60


// Create the game objects
var hero = {
  speed: 256 // movement speed of hero in pixels per second
};
var monster = {};  // empty object, we'll add stuff later
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};  // empty object, we'll add stuff later
// Check for keys pressed where key represents the keycode captured
addEventListener("keydown", function (key) {
  keysDown[key.keyCode] = true;  // add an element to array storing value for which key they pushed
}, false);
addEventListener("keyup", function (key) {
  delete keysDown[key.keyCode];
}, false);
// what does the false do?   It determines whether or not the default browser behaviour should take place as well. 
// This is most noticeable in form submit handlers, where you can cancel a form submission if the user has made a
// mistake entering the information.

// Define a function to reset the player and monster positions when player catches a monster
var reset = function () {
  // Reset player's position to centre of canvas
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  // Place the monster somewhere on the canvas randomly
  // monster.x = 32 + (Math.random() * (canvas.width - 64));
  // monster.y = 32 + (Math.random() * (canvas.height - 64));
  monster.x = (50) + (Math.random() * (canvas.width - 228)); //account for tree  (64 + 50) * 2
  monster.y = (50) + (Math.random() * (canvas.height - 228));
};

var update = function (modifier) {     // modifier parameter modifys the speed  value for character motion
  if (38 in keysDown && hero.y > 60) { // Player is holding up key
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown && hero.y < canvas.height - (64+60)) { // Player is holding down key
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown && hero.x > (50)) { // Player is holding left key
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown && hero.x < canvas.width-(64+50)) { // Player is holding right key
    hero.x += hero.speed * modifier;
  }
  // Check if player and monster collider
  if (
    hero.x <= (monster.x + 64)  // 32 is lenght and width of the characters
    && monster.x <= (hero.x + 64)
    && hero.y <= (monster.y + 64)
    && monster.y <= (hero.y + 64)
  ) {
    snd.play();
    ++monstersCaught;  // count up in our score
    reset();  // call that function to move the player and monster
  }
};

// Function to Draw everything on the canvas
var render = function () {
  if (bgReady) {                  // not really sure the use of this if, if its not ready, it fails anyhow??
    ctx.drawImage(bgImage, 0, 0);   // place image using the upper left corner, so 0,0
  }
  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }
  if (treeReady) {   // 50 by 60
    let x = 0;
    let y = 0;
    for (x = 0; x < 799 ; x = x + 50)
    {
      ctx.drawImage(treeImage, x, 0); 
      ctx.drawImage(treeImage, x, 740); 
    }
    for (y = 0; y < 799; y = y + 60) {
      ctx.drawImage(treeImage, 0, y);
      ctx.drawImage(treeImage, 750, y);
    }
    
  }
  // Display score and time 
  ctx.fillStyle = "rgb(0, 0, 250)";  // white text
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Fish caught: " + monstersCaught, 20, 20);
  ctx.fillText("Time: " + count, 20, 50);
  // Display game over message when timer finished
  if(finished==true){
    ctx.fillText("Game over!", 200, 220);
  }
  
};

var count = 300; // how many seconds the game lasts for - default 30
var finished = false;
var counter =function(){
  count=count-1; // countown by 1 every second
  // when count reaches 0 clear the timer, hide monster and
  // hero and finish the game
    if (count <= 0)
    {
      // stop the timer
       clearInterval(counter);
       // set game to finished
       finished = true;
       count=0;
       // hider monster and hero
       monsterReady=false;
       heroReady=false;
    }
}

// timer interval is every second (1000ms)
setInterval(counter, 1000);  // see explanation below, only being used to count down the game seconds
// The main game loop
var main = function () {
  update(0.02); // check state of keys and for collisions, pass in a modifier  which "scales" the speed based on how
                // fast the requestAnimationFrame is cycling (fast or slow browser)
  render();   // redraw everything
  requestAnimationFrame(main);   // Request to do this again ASAP
};
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
reset();  // place 2 char's for the first time
main();   // start the loop that tics of game cycles
