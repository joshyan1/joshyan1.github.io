const levels = [
		//level 0
		["flag", "rock", "animate", "", "",
		"fenceside", "rock", "animate", "", "rider",
		"", "tree", "animate", "", "",
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
		"", "", "fence", "", "",
		"rider", "rock", "", "", "horseup"],
	];//end of levels
	
const gridBoxes = document.querySelectorAll("#gameBoard div");
var currentLevel = 0;//starting level
var riderOn = false;//rider on horse
var currentLocationOfHorses = 0;
var currentAnimation; //allows 1 animation per level

//startgame
window.addEventListener("load", function(){
	loadLevel();
});

//load levels 0 - max
function loadLevel(){
    let levelMap = levels[currentLevel];
	let animateBoxs;
	riderOn = false;
	
	//load board
	for(i = 0; i < gridBoxes.length; i++){
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("horse")) curentLocationOfHorse = i;
	}
	
	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "down");
}

//animate enemy left to right
//boxes - array of grid boxes that include animate
//index - current location of animation
//direction - direction of animation
function animateEnemy(boxes, index, direction){
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
		console.log("boxes index is " + index + " and boxes has length "  + boxes.length);
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
	if(direction == "right"){
		//turn around if hitright side
		if(index == boxes.length - 1){
			index--;
			direction = "left";
		} else {
			index++;
		}//else
	}else if(direction == "left"){
		//turn around if hit left side
		if(index == 0){
			index++;
			direction = "right";
		}else{
			index--;
		}//else
	}else if(direction == "up"){
		//turn around if hit top side
		if(index == 0){
			index++;
			direction = "down";
		}else{
			index--;
		}//else
	}else if(direction == "down"){
		//turn around if hit bottom side
		if(index == boxes.length - 1){
			console.log("here")
			index--;
			direction = "up";
		}else{
			index++;
		}//else
	}		
	
	currentAnimation = setTimeout(function() {animateEnemy(boxes, index, direction);}, 700);
	
}//animateEnemy

	
	
	