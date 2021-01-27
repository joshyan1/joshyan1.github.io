const levels = [
		//level 0 (1)
		["treasure", "spike", "animate", "pickaxe", "", "", "", "",
		"drockside", "tree", "animate", "tree", "tree", "tree", "tree", "",
		"", "spike", "animate", "", "", "", "", "",
		"", "water", "animate", "water", "water", "water", "water", "water",
		"", "tree", "", "spike", "", "", "", "",
		"", "spike", "", "spike", "", "spike", "tree", "",
		"", "spike",  "", "spike", "", "spike", "playerright", "",
		"", "drock",  "", "", "", "spike", "tree", ""],
	
		//level 1 (2)
		["", "spike", "", "", "spike", "", "", "",
		"", "drock", "", "", "drock", "", "tree", "",
		"", "spike", "tree", "tree", "spike", "", "", "",
		"", "spike", "spike", "spike", "spike", "spike", "spike", "",
		"", "animate", "drock", "", "", "", "spike", "",
		"spike", "animate", "spike", "spike", "spike", "", "spike", "",
		"pickaxe", "animate", "tree", "playerdown", "tree", "", "spike", "",
		"spike", "animate", "", "", "", "", "spike", "treasure"],
	
		//level 2 (3)
		["", "", "", "animate", "animate", "animate", "", "",
		"", "tree", "tree", "tree", "", "tree", "drockside", "tree",
		"", "", "", "tree", "pickaxe", "tree", "", "spike",
		"", "", "", "spike", "spike", "spike", "", "spike",
		"", "", "spike", "spike", "water", "", "", "spike",
		"", "", "drock", "treasure", "drock", "", "", "spike",
		"", "spike", "spike", "spike", "spike", "spike", "", "spike",
		"", "", "", "playerleft", "spike", "", "", ""],
		
		//level 3 (4)
		["tree", "tree", "tree", "tree", "", "spike", "water", "",
		"spike", "treasure", "", "drock", "", "spike", "water", "",
		"water", "drockside", "water", "water", "animate", "spike", "water", "",
		"", "", "", "", "animate", "spike", "water", "",
		"", "spike", "spike", "spike", "animate", "spike", "water", "",
		"", "spike", "", "", "animate", "", "", "",
		"", "spike", "spike", "spike", "spike", "spike", "spike", "",
		"", "", "playerleft", "spike", "pickaxe", "", "", ""],
	];//end of levels
	
const gridBoxes = document.querySelectorAll("#gameBoard div"); //all grid boxes
const noPassObstacles = ["spike", "tree", "water"]; //non passable objects
var currentLevel = 0;//starting level
var riderOn = false;//rider on player
var currentLocationOfPlayer = 0; //stores location of player
var currentAnimation; //allows 1 animation per level
var widthOfBoard = 8; //stores width of board
var stopInput = false; //accept input or not
var lives = 3; //stores lives
var gamePaused = false; //store if game paused
var speedSubtraction = 0; //substract from animate enemy, to speed up animation
var timer = 120; //stores timer
var controlTime; //used to control timer start/stop
var lights = 0; //stores opacity of gameboard
var difficulty = "easy";

//used to start game, turns all elements to "none" except gameboard and panel, resets variables
function startGame(){
	currentLevel = 0;
	riderOn = false;
	lives = 3;
	speedSubtraction = 0;
	lights = 0;
	
	switch(difficulty){
		case "med":
			timer = 75;
			break;
		case "hard": 
			timer = 40;
			break;
		case "insane":
			timer = 20;
			break;
		default:
			timer = 120;
	}//switch

	document.getElementById("gameBoard").style.opacity = 1;
	document.getElementById("timer").innerHTML = timer + "s"
	document.getElementById("lose").style.display = "none";
	document.getElementById("level").innerHTML = "Level: " + (currentLevel + 1);
	document.getElementById("panel").style.display = "block";
	document.getElementById("lives").innerHTML = "Lives: " + lives;
	document.getElementById("gameBoard").style.display = "grid";
	document.getElementById("endScreen").style.display = "none";
	document.getElementById("startScreen").style.display = "none";
	document.getElementById("infopage").style.display = "none";
	
	loadLevel();

}//startGame

//function used to return back to the start screen
function returnHome(){
	clearTimeout(currentAnimation);
	document.getElementById("infopage").style.display = "none";
	document.getElementById("startScreen").style.display = "block";
	document.getElementById("gamePaused").style.display = "none";
	document.getElementById("lose").style.display = "none";
	document.getElementById("lifeLost").style.display = "none";
	document.getElementById("gameBoard").style.display = "none";
	document.getElementById("endScreen").style.display = "none";
	document.getElementById("panel").style.display = "none";
	gamePaused = false;

}//returnHome


//move player
document.onkeydown = function(e){movePlayer(e);}
function movePlayer(e){
	
	if(e.keyCode == 27 && gamePaused){
		resumeGame();
		return;
	}//if
	
	//takes in input if the gameboard is being displayed and !stop input isn't being ran
	if(document.getElementById("gameBoard").style.display == "grid" && !stopInput){
		switch(e.keyCode){
			
			case 27://escape
				pauseGame();	
				break;
			
			case 37://left arrow
				if(currentLocationOfPlayer % widthOfBoard !== 0){
					tryToMove("left");
				}
				break;
			case 38://up arrow
				if(currentLocationOfPlayer - widthOfBoard >= 0){
					tryToMove("up");
				}
				break;
			case 39://right arrow
				if(currentLocationOfPlayer % widthOfBoard < widthOfBoard - 1){
					tryToMove("right");
				}
				break;
			case 40://down arrow
				if(currentLocationOfPlayer + widthOfBoard < widthOfBoard * widthOfBoard){
					tryToMove("down");
				}
				break;
		}//switch
	}
}//keylistener

//try to move player
function tryToMove(direction){

	//location before move
	let oldLocation = currentLocationOfPlayer;

	//class of location before move
	let oldClassName = gridBoxes[oldLocation].className;

	//next location
	let nextLocation = 0;

	//nextclass
	let nextClass = "";

	//new class
	let newClass = "";

	//next next location
	let nextLocation2 = 0;

	//next next class
	let nextClass2 = "";

	switch(direction){
		case "left":
			nextLocation = currentLocationOfPlayer - 1;
			break;
		case "right":
			nextLocation = currentLocationOfPlayer + 1;
			break;
		case "down":
			nextLocation = currentLocationOfPlayer + widthOfBoard;
			break;
		case "up":
			nextLocation = currentLocationOfPlayer - widthOfBoard;
			break;
	}//switch

	nextClass = gridBoxes[nextLocation].className;
	//if the obstacle is not passable, dont move
	if(noPassObstacles.includes(nextClass)){return;}

	//if next obstacle is a drock, and there is no rider, don't move
	if(!riderOn && nextClass.includes("drock")) {return;}

	//if there is a drock, move to spaces with animation
	if(nextClass.includes("drock")){
		//need rider to jump	
		if(riderOn){
			stopInput = true;
			oldClassName = gridBoxes[nextLocation].className;

			if(direction == "left"){
				nextClass = "jumpleft";
				nextClass2 = "playerpickleft";
				nextLocation2 = nextLocation - 1;
			}//if
			else if(direction == "right"){
				nextClass = "jumpright";
				nextClass2 = "playerpickright";
				nextLocation2 = nextLocation + 1;
			}//else if
			else if(direction == "up"){
				nextClass = "jumpup";
				nextClass2 = "playerpickup";
				nextLocation2 = nextLocation - widthOfBoard;
			}//else if
			else if(direction == "down"){
				nextClass = "jumpdown";
				nextClass2 = "playerpickdown";
				nextLocation2 = nextLocation + widthOfBoard;
			}//else if

			if(noPassObstacles.includes(gridBoxes[nextLocation2].className)){
			stopInput = false;
			return;
			}//if
			
			gridBoxes[currentLocationOfPlayer].className = "";

			//show player jumping
			gridBoxes[nextLocation].className = nextClass;

			stopInput = true;
			setTimeout(function() {
				stopInput = false;
				//set jump back to just a drock
				gridBoxes[nextLocation].className = oldClassName;

				//update currrentlocation of player to be 2 spaces past take off.
				currentLocationOfPlayer = nextLocation2;

				//get class of box after jump
				nextClass = gridBoxes[currentLocationOfPlayer].className;

				//show player and rider after landing
				gridBoxes[currentLocationOfPlayer].className = nextClass2;

				//if next box is a flag, go up a level
				levelUp(nextClass);

			}, 350);//setTimeout
			return;
		}//if riderOn
	}

	//if there is a rider, add rider
	if(nextClass == "pickaxe") {
		riderOn = true;
	}//if

	gridBoxes[oldLocation].className = "";

	//build name of new class
	newClass = (riderOn) ? "playerpick" : "player";
	newClass += direction;

	//move 1 space
	currentLocationOfPlayer = nextLocation;
	gridBoxes[currentLocationOfPlayer].className = newClass;

	//if it is an enemy, end game
	if(nextClass.includes("enemy")) {
		dead();
		return;
	}//if

	//move up to next level
	levelUp(nextClass);

}//try to move

//updates the gameboard for the next level
function levelUp(nextClass){
	if(nextClass == "treasure" && riderOn){
		clearTimeout(currentAnimation);
		
		if(currentLevel < 3){
			stopInput = true;
			window.clearInterval(controlTime);
			document.getElementById("levelup").style.display = "block";
			setTimeout(function(){
			document.getElementById("levelup").style.display = "none";
			currentLevel++;
			loadLevel();
			}, 1000);//setTimeout
		}//if
		else {
			endGame();
		}//else
	}//if

}//levelUp

//load levels 0 - max
function loadLevel(){
    let levelMap = levels[currentLevel];
	let animateBoxes;
	let direction = "";
	stopInput = false;
	riderOn = false;
	speedSubtraction += 50;
	
	//remove previous messages
	document.getElementById("lifeLost").style.display = "none";
	
	//load board
	document.getElementById("level").innerHTML = "Level: " + (currentLevel + 1);
	for(i = 0; i < gridBoxes.length; i++){
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("player")){
			currentLocationOfPlayer = i;
		}//if
	}//for
	
	animateBoxes = document.querySelectorAll(".animate");
	if(currentLevel == 2){
		animateEnemy(animateBoxes, 0, "right");
	}//if
	else{
		animateEnemy(animateBoxes, 0, "down");
	}//else
	controlTime = window.setInterval(gameTime, 1000);

}//loadLevel

//animate enemy left to right
//boxes - array of grid boxes that include animate
//index - current location of animation
//direction - direction of animation
function animateEnemy(boxes, index, direction){
	if(lives == 0 || gamePaused){
		currentAnimation = setTimeout(function() {animateEnemy(boxes, index, direction);}, 750);
		return;
	}//if
	let previousDirection = "";//resets previousDirection

	//exit function if no animate boxes
	if (boxes.length <= 0){return;}

	//update images
	if(direction == "right") {
		boxes[index].classList.add("enemyright");
	}//if
	else if(direction == "left") {
		boxes[index].classList.add("enemyleft");
	}//else if
	else if(direction == "up") {
		boxes[index].classList.add("enemyup");
	}//else if
	else if(direction == "down") {
		boxes[index].classList.add("enemydown");
	}//else if
	
	//remove images from other boxes
	for(i = 0; i < boxes.length; i++){
		if(i != index){
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");
			boxes[i].classList.remove("enemyup");
			boxes[i].classList.remove("enemydown");
		}//if
	}//for
	
	//moving right
	previousDirection = direction;
	if(direction == "right"){

		//turn around if hitright side
		if(index == boxes.length - 1){
			index--;
			direction = "left";
		} //if
		else {
			index++;
		}//else
	}else if(direction == "left"){
		//turn around if hit left side
		if(index == 0){
			index++;
			//previousDirection = direction;
			direction = "right";
		}//if
		else{
			index--;
		}//else
	}else if(direction == "up"){
		//turn around if hit top side
		if(index == 0){
			index++;
			//previousDirection = direction;
			direction = "down";
		}//if
		else{
			index--;
		}//else
	}else if(direction == "down"){
		//turn around if hit bottom side
		if(index == boxes.length - 1){
			index--;
			//previousDirection = direction;
			direction = "up";
		}//if
		else{
			index++;
		}//else
	}//if

	//kill player 
	if(gridBoxes[currentLocationOfPlayer].classList.contains("enemy" + previousDirection)){
		dead();
		return;
	}//if	
	
	currentAnimation = setTimeout(function() {animateEnemy(boxes, index, direction);}, 750 - speedSubtraction);
	//currentAnimation2 = setTimeout(function() {animateEnemy(boxes, index, direction);}, 700);
	
}//animateEnemy

//runs when player dies
function dead(){
	lives--;
	document.getElementById("lives").innerHTML = "Lives: " + lives;
	clearTimeout(currentAnimation);
	window.clearInterval(controlTime);

	if(lives > 0){
		//changeVisibility("lifeLost");
		document.getElementById("lifeLost").style.display = "block";
		stopInput = true;
	}//if 
	else{
		endGame();
	}//else
}//dead

function endGame(){
	clearTimeout(currentAnimation);
	window.clearInterval(controlTime);
	stopInput = true;

	if(lives == 0){

		document.getElementById("lose").style.display = "block";

	}//if
	else{
		
	document.getElementById("gameBoard").style.display = "none";
	document.getElementById("panel").style.display = "none";
	document.getElementById("endScreen").style.display = "block";
	document.getElementById("info").innerHTML = "Jeremy the Miner has beaten the dungeon with " + timer + " seconds and " + lives + " lives remaining!\n" + "Now he's rich, thanks to you!";

	}//else
}//endGame

//displays info page
function displayInstructions(){
	document.getElementById("infopage").style.display = "block";

}//displayInstructions

//pauses the game
function pauseGame(){
	gamePaused = true;
	stopInput = true;
	document.getElementById("gamePaused").style.display = "block";
	window.clearInterval(controlTime);
	
}//pauseGame

//resumes game if paused
function resumeGame(){
	gamePaused = false;
	stopInput = false;
	document.getElementById("gamePaused").style.display = "none";
	controlTime = window.setInterval(gameTime, 1000);
	//changeVisibility("gamePaused");
}//resumeGame

//counts down game time
function gameTime(){
	timer--;
	if(timer == 0){
		lives = 0;
		document.getElementById("losereason").innerHTML = "You Ran Out Of Time";
		endGame();
	} //if
	//dims the game every 20 seconds for effect, mostly used on easy and medium
	//on hard and insane, not enough time to be taken into effect
	else if(timer%20 == 0){
		lights += 1/10;
		document.getElementById("gameBoard").style.opacity = 1 - lights;
	}//else if

	document.getElementById("timer").innerHTML = timer + "s";
}//gameTime

//lets player choose difficulty (timer)
function chooseDifficulty(choice){

	switch(choice){
		case 1:
			difficulty = "easy";
			document.getElementById("easy").style.backgroundImage = "url('images/selectedstars.jpg')";
			document.getElementById("medium").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("hard").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("insane").style.backgroundImage = "url('images/stars.gif')";
			break;
		case 2:
			difficulty = "med";
			document.getElementById("medium").style.backgroundImage = "url('images/selectedstars.jpg')";
			document.getElementById("easy").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("hard").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("insane").style.backgroundImage = "url('images/stars.gif')";
			break;
		case 3:
			difficulty = "hard";
			document.getElementById("hard").style.backgroundImage = "url('images/selectedstars.jpg')";
			document.getElementById("medium").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("easy").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("insane").style.backgroundImage = "url('images/stars.gif')";
			break;
		case 4:
			difficulty = "insane";
			document.getElementById("insane").style.backgroundImage = "url('images/selectedstars.jpg')";
			document.getElementById("medium").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("hard").style.backgroundImage = "url('images/stars.gif')";
			document.getElementById("easy").style.backgroundImage = "url('images/stars.gif')";
	}//switch
}//gameTime
