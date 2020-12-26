var dog, happyDogImg, hungryDog, dogImg, deadDogImg, dogSleepImg, dogRunImg, dogRunLeftImg;
var database;
var frameCountNow = 0;
var vaccinationChartImg;
var input, button, name;
var gameState = "hungry"; 
var gamestateRef;
var bedroomImg, gardenImg, washroomImg, livingroomImg, vaccinationImg, foodStockImg, injectionImg;
var feed, addFoods;
var feedTime, lastFed, currentTime;
var foodS, foodStock, foodStockRef, foodObj, fedTime, addFood, milkImg;

function preload()
{
  dogImg         = loadImage("images/Dog.png");
  happyDogImg    = loadImage("images/Happy.png");
  milkImg        = loadImage("images/Milk.png");
  bedroomImg     = loadImage("images/Bed Room.png");
  deadDogImg     = loadImage("images/deadDog.png");
  foodStockImg   = loadImage("images/Food Stock.png");
  gardenImg      = loadImage("images/Garden.png");
  injectionImg   = loadImage("images/Injection.png");
  dogSleepImg    = loadImage("images/Lazy.png");
  livingroomImg  = loadImage("images/Living Room.png");
  dogRunImg      = loadImage("images/running.png");
  dogRunLeftImg  = loadImage("images/runningLeft.png");
  vaccinationImg = loadImage("images/Vaccination.jpg");
  washroomImg    = loadImage("images/Wash Room.png");
  vaccinationChartImg = loadImage("images/dogVaccination.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1200, 900);

  foodObj = new Food();

  dog = createSprite(700, 220, 150, 150);
  dog.addImage(dogImg);
  dog.addImage("happy", happyDogImg);
  dog.addImage("dead", deadDogImg);
  dog.addImage("sleep", dogSleepImg);
  dog.addImage("run", dogRunImg);
  dog.addImage("run", dogRunLeftImg);
  dog.scale = 0.3;

  getgameState();

  feed = createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);
  
  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  input = createInput("Pet Name");
  input.position(950, 120);

  button = createButton("Confirm");
  button.position(1000, 145);
  button.mousePressed(createName);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
}

function draw() {  
  background(255);

  currentTime = hour();
  
  if(currentTime === lastFed + 1){
     gameState = "playing";
     updategameState();
     image.garden(); 
  }
  else if(currentTime === lastFed + 2){
     gameState = "sleeping";
     updategameState();
     foodObj.bedroom();
  }
  else if(currentTime > lastFed + 2 && currentTime <= lastFed + 4){
    gameState = "bathing";
    foodObj.washroon();
  }
  else{
    gameState = "hungry";
    updategameState();
    foodObj.display();
  }
  
  //console.log(gameState);

  foodObj.getFoodStock();
  //console.log(foodStock);
  getgameState();

  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  if(gameState === "hungry"){
     feed.show();
     addFood.show();
     dog.addImage("hungry", hungryDog);
  }
  else{
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  drawSprites();

  textSize(20);
  fill("red");
  text("Last fed: " + lastFed + ":00", 300, 95);
  text("Time since last fed: " + (currentTime - lastFed), 300, 125);
}

  function feedDog(){
    foodObj.deductFood();
    foodObj.updateFoodStock();
    dog.changeAnimation("happy", happyDogImg);
    gameState = "happy";
    updategameState();
  }

  function addFoods(){
   foodObj.addFood();
   foodObj.updateFoodStock();
  }

  async function hour(){
    var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/Tokyo");
    var siteJSON = await site.json();
    var datetime = siteJSON.datetime;
    var hourTime = datetime.slice(11, 13);
    return hourTime;
  }

function createName(){
   input.hide();
   button.hide();
   
   fill("white");
   Name = input.value();
   var greeting = createElement('h3');
   greeting.html("Pet's name: " + Name);
   greeting.position(500, 500);
}

function getgameState(){
  gamestateRef = database.ref('gameState');
  gamestateRef.on("value", function(data){
    gamestate = data.val();
  })
}

function updategameState(){
   database.ref('/').update({
     gameState: gameState
   })
}

