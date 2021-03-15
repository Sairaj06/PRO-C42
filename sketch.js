var PLAY = 1;
var END = 0;
var gameState = PLAY;
var database;

var monkey ,jungle, monkey_running;
var gameOverImg, banana ,bananaImage, obstacle, obstacleImage;
var bananaGroup, obstacleGroup;
var score = 0;


function preload(){
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  jungleImg = loadImage("jungle.jpg");
  gameOverImg = loadImage("gameOver.png");
}

function setup() {
  database = firebase.database();
  createCanvas(800,400);
  
  jungle = createSprite(0,0,800,400);
  jungle.addImage(jungleImg);
  jungle.x = jungle.width/2;
  jungle.scale = 1.85; 
  jungle.velocityX = -(4 + 2*(score/10));

  
  monkey = createSprite(80,300,20,20);
  monkey.addAnimation("moving", monkey_running);
  monkey.scale = 0.1;
  
  ground = createSprite(400,300,900,10);
  ground.velocityX = -4;
  ground.visible = false;
  ground.x = ground.width/2;
  console.log(ground.x);
  
  bananaGroup = createGroup();
  obstaclesGroup = createGroup();   
}


function draw() {
  background(jungleImg);
  if(gameState === PLAY)
  {
    if(ground.x < 0){
      ground.x = 200;
    }

    if(jungle.x < 100){
      jungle.x = jungle.width/2; 
    } 

    if(keyDown("space")){
      monkey.velocityY = -12;
    }

    monkey.velocityY = monkey.velocityY + 0.8;
    monkey.collide(ground);
    
    
    if(bananaGroup.isTouching(monkey)){
      bananaGroup.destroyEach();
      score = score + 2;
    }
    switch(score){
        case 10: monkey.scale=0.12;
                break;
        case 20: monkey.scale=0.14;
                break;
        case 30: monkey.scale=0.16;
                break;
        case 40: monkey.scale=0.18;
                break;
        default: break;
    }

    if(obstaclesGroup.isTouching(monkey)){
      monkey.scale = 0.1;
      obstaclesGroup.destroyEach();
      gameState = END;
    } 
        
    spawnBananas();
    spawnObstacles(); 
  
    drawSprites(); 
  }
  
 if(gameState === END)
 {
    jungle.velocityX = 0;
    monkey.visible = false;
  
    bananaGroup.destroyEach();
    obstaclesGroup.destroyEach();
    
    stroke(255);
    textSize(30);
    fill(255);
    text("Game Over!!", 300, 220);
}
  
  stroke("white");
  textSize(20);
  fill("white");
  text("Score:" + score, 500,50);
}

function spawnBananas()
{
  if(World.frameCount % 80 === 0)
  {
    banana = createSprite(800,200,20,20);
    banana.addImage(bananaImage);
    banana.scale = 0.065;
    banana.velocityX = -(6.5 + 2*(score/10));
    banana.y = Math.round(random(50,130));
    banana.lifetime = 200;
    monkey.depth = banana.depth + 1;
    bananaGroup.add(banana);
  }
}

function spawnObstacles()
{
  if(World.frameCount % 100 === 0)
  {
    obstacle = createSprite(800,270,20,20);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.18;
    obstacle.velocityX = -(6 + 2*(score/10));
    obstaclesGroup.add(obstacle);
  }
}