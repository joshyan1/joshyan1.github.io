const levels = [
		//level 0
		["flag", "rock", "", "", "",
		"fenceside", "rock", "", "", "rider",
		"", "tree", "animate", "animate", "animate",
		"", "water", "", "", "",
		"", "fence", "", "horseup", ""],
	
		//level 1
		["flag", "water", "", "", "",
		"fenceside", "water", "", "", "rider",
		"animate", "bridge animate", "animate", "animate", "animate",
		"", "water", "", "", "",
		"", "water", "", "horseup", ""],
	
		//level 2
		["tree", "tree", "flag", "tree", "tree",
		"animate", "animate", "animate", "animate", "animate",
		"water", "bridge", "water", "water", "water",
		"", "", "", "", "fence",
		"rider", "rock", "", "", "horseup"],
	];//end of levels
	
const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["rock", "tree", "water"];
var currentLevel = 0;//starting level
var riderOn = false;//rider on horse
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level
var widthOfBoard = 5;

//startgame
window.addEventListener("load", function(){
	loadLevel();
});

//move horse
document.addEventListener("keydown", function (e) {

	switch(e.keyCode){

		case 37://left arrow
			if(currentLocationOfHorse % widthOfBoard !== 0){
				tryToMove("left");
			}
			break;
		case 38://up arrow
			if(currentLocationOfHorse - widthOfBoard >= 0){
				tryToMove("up");
			}
			break;
		case 39://right arrow
			if(currentLocationOfHorse % widthOfBoard < widthOfBoard - 1){
				tryToMove("right");
			}
			break;
		case 40://down arrow
			if(currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard){
				tryToMove("down");
			}
			break;
	}//switch
});//keylistener

//try to move horse
function tryToMove(direction){

	//location before move
	let oldLocation = currentLocationOfHorse;

	//class of location before move
	let oldClassName = gridBoxes[oldLocation].className;

	let nextLocation = 0;
	let nextClass = "";
	let newClass = "";
	let nextLocation2 = 0;
	let nextClass2 = "";
	switch(direction){
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			nextLocation = currentLocationOfHorse + 1;
			break;
		case "down":
			nextLocation = currentLocationOfHorse + widthOfBoard;
			break;
		case "up":
			nextLocation = currentLocationOfHorse - widthOfBoard;
			break;
	}//switch

	console.log(nextLocation);
	nextClass = gridBoxes[nextLocation].className;

	//if the obstacle is not passable, dont move
	if(noPassObstacles.includes(nextClass)){return;}

	//if next obstacle is a fence, and there is no rider, don't move
	if(!riderOn && nextClass.includes("fence")) {return;}

	//if there is a fence, move to spaces with animation
	if(nextClass.includes("fence")){

		//need rider to jump	
		if(riderOn){
			gridBoxes[currentLocationOfHorse].className = "";
			oldClassName = gridBoxes[nextLocation].className;

			if(direction == "left"){
				nextClass = "jumpleft";
				nextClass2 = "horseriderleft";
				nextLocation2 = nextLocation - 1;
			} else if(direction == "right"){
				nextClass = "jumpright";
				nextClass2 = "horseriderright";
				nextLocation2 = nextLocation + 1;
			} else if(direction == "up"){
				nextClass = "jumpup";
				nextClass2 = "horseriderup";
				nextLocation2 = nextLocation - widthOfBoard;
			} else if(direction == "down"){
				nextClass = "jumpdown";
				nextClass2 = "horseriderdown";
				nextLocation2 = nextLocation + widthOfBoard;
			}

			//show horse jumping
			gridBoxes[nextLocation].className = nextClass;

			setTimeout(function() {
				
				//set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;

				//update currrentlocation of horse to be 2 spaces past take off.
				currentLocationOfHorse = nextLocation2;

				//get class of box after jump
				nextClass = gridBoxes[currentLocationOfHorse].className;

				//show horse and rider after landing
				gridBoxes[currentLocationOfHorse].className = nextClass2;

				//if next box is a flag, go up a level
				levelUp(nextClass);

			}, 350);
			return;
		}//if riderOn
	}

	//if there is a rider, add rider
	if(nextClass == "rider") {
		riderOn = true;
	}

	//if there is a bridge in the old location, keep it
	if(oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	}

	//build name of new class
	newClass =(riderOn) ? "horserider" : "horse";
	newClass += direction;

	//if there is a bridge in the next location, keep it
	if(gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	}

	//move 1 space
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;

	//if it is an enemy, end game
	if(nextClass.includes("enemy")) {
		endGame();
		return;
	}

	//move up to next level
	levelUp(nextClass);

}//try to move

function levelUp(nextClass){
	if(nextClass == "flag" && riderOn){
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout(function(){
			document.getElementById("levelup").style.display = "none";
			if(currentLevel < 2){
				currentLevel++;
				loadLevel();
			}

		}, 1000);
	}

}

//load levels 0 - max
function loadLevel(){
    let levelMap = levels[currentLevel];
	let animateBoxs;
	let direction = "";
	riderOn = false;
	
	//load board
	for(i = 0; i < gridBoxes.length; i++){
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("horse")) currentLocationOfHorse = i;
	}
	
	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "right");
}

//animate enemy left to right
//boxes - array of grid boxes that include animate
//index - current location of animation
//direction - direction of animation
function animateEnemy(boxes, index, direction){
	let previousDirection = "";
	//exit function if no animate boxes
	if (boxes.length <= 0){return;}

	//update images
	if(direction == "right") {
		boxes[index].classList.add("enemyright");
	}else if(direction == "left") {
		boxes[index].classList.add("enemyleft");
	}else if(direction == "up") {
		boxes[index].classList.add("enemyup");
	}else if(direction == "down") {
		boxes[index].classList.add("enemydown");
	}
	
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
			//previousDirection = direction;
			direction = "left";
		} else {
			index++;
		}//else
	}else if(direction == "left"){
		//turn around if hit left side
		if(index == 0){
			index++;
			//previousDirection = direction;
			direction = "right";
		}else{
			index--;
		}//else
	}else if(direction == "up"){
		//turn around if hit top side
		if(index == 0){
			index++;
			//previousDirection = direction;
			direction = "down";
		}else{
			index--;
		}//else
	}else if(direction == "down"){
		//turn around if hit bottom side
		if(index == boxes.length - 1){
			index--;
			//previousDirection = direction;
			direction = "up";
		}else{
			index++;
		}//else
	}	

	console.log("previous direction is " + previousDirection);
	console.log("direction is " + direction);
	if(gridBoxes[currentLocationOfHorse].classList.contains("enemy" + previousDirection)){
		console.log("madeit");
		endGame();
		return;
	}//if	
	
	currentAnimation = setTimeout(function() {animateEnemy(boxes, index, direction);}, 700);
	
}//animateEnemy

function endGame(){
	document.getElementById("lose").style.display = "block";
	clearTimeout(currentAnimation);
}

	
	
	