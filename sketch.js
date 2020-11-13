

var dog, happyDog, database, foodS, foodStock;
var addFood,feed;
var fedTime, lastFed;
var foodObj;
var changeGameState, readGameState;
var bedroom, garden, washroom;
var bedroomImg, gardenImg, washroomImg;
var gameState = 0;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage ("images/dogImg1.png");
  bedroomImg = loadImage ("images/Bed Room.png");
  gardenImg = loadImage ("images/Garden.png");
  washroomImg = loadImage ("images/Wash Room.png");
  sadDog = loadImage("images/deadDog.png");
 
}



function setup() {
  createCanvas(500, 500);
  database = firebase.database();
  dog = createSprite (200,200,10,10);
  dog.addImage(dogImg)
  dog.scale = 0.3

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();

    
  });

  foodObj = new Food();

  feed = createButton ("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);
}


function draw() {  
  background(46, 139, 87);

  
  fedTime = database.ref ('FeedTime');
  fedTime.on ("value", function(data){
    lastFed = data.val();
  });

  if (gameState!= "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if (currentTime == (lastFed+2)){
    update ("Sleeping");
    foodObj.bedroom();
  }

  else if ((currentTime>lastFed+2) && currentTime<= (lastFed+4)){
    update ("Bathing");
    foodObj.washroom();
  }

  else{
    update("Hungry")
    foodObj.display();
  }

  textSize(20);
  fill("white");
  text ("Food Left"+ foodS, 300,300);

  fill (255,255,254);
  textSize (15)
  if (lastFed >= 12) {
      text ("Last Feed: " + lastFed%12 + " PM", 350,30 );
  }
  else if (lastFed == 0){
      text ("Last Feed: 12 AM", 350, 30)
  }
  else{
      text ("Last Feed: " + lastFed + " AM", 350, 30)
  }

  foodObj.display();
  drawSprites();
  //add styles here
  
}

/*function writeStock(x){
  if (x<=0){
    x = 0
  }
  else {
    x = x-1;
  }
  

  database.ref ('/').update({
    Food:x
  })
}
*/

function readStock (data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}

