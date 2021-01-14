let currentPlayer = "X";
let gameStatus = "";// "" - continue, "Tie", "X Wins", "O Wins"
let numTurns = 0;
let idNames = ["one", "two", "three", "four", 
				"five", "six", "seven", "eight", "nine"];
let recentMove = "";

//reset board and variables
function newGame(){
	
	for(i = 0; i < idNames.length; i++){
		document.getElementById(idNames[i]).innerHTML = "";
	}
	
	numTurns = 0;
	gameStatus = "";
	currentPlayer = "X";
	
	changeVisibility("controls");
	changeVisibility("newbutton");
}
				
				
//take player turn
function playerTakeTurn(e){
	if(e.innerHTML == ""){
		e.innerHTML = currentPlayer;
		inputPause();
		checkGameStatus();
	
		if(gameStatus == ""){
			setTimeout(function(){
					computerTakeTurn();
					checkGameStatus();
				}, 250
			);
			//computerTakeTurn();
			//checkGameStatus();
		}//if
	} else {
		showLightBox("This box is already selected.", "Please use another.");
		return;
	}//else
	
}//playertakeTurn

//after each turn, check for a winner, a tie
//or continue playing
function checkGameStatus(){
	numTurns++;
	
	//check for a win
	if(checkWin()){
		gameStatus = currentPlayer + " Wins!";
	}
	
	//check for tie
	
	else if(numTurns == 9){
		gameStatus = "Tie Game";	
	}
	
	//switch current player
	currentPlayer = (currentPlayer == "X" ? "O" : "X" );

	if(gameStatus != ""){
		showLightBox(gameStatus, "Game Over.");
		//setTimeout(function(){showLightBox(gameStatus, "Game Over.");}, 500);
	}//if
}//checkGameStatus

//check for a win
function checkWin(){
	let cb = [];//current board
	cb [0] - "";
	cb [1] = document.getElementById("one").innerHTML;
	cb [2] = document.getElementById("two").innerHTML;
	cb [3] = document.getElementById("three").innerHTML;
	cb [4] = document.getElementById("four").innerHTML;
	cb [5] = document.getElementById("five").innerHTML;
	cb [6] = document.getElementById("six").innerHTML;
	cb [7] = document.getElementById("seven").innerHTML;
	cb [8] = document.getElementById("eight").innerHTML;
	cb [9] = document.getElementById("nine").innerHTML;
	
	
	if(cb[1] != "" && cb[1] == cb[2] && cb[2] == cb[3]){
		return true;
	}
	
	if(cb[1] != "" && cb[1] == cb[2] && cb[2] == cb[3]){
		return true;
	}	
	
	if(cb[1] != "" && cb[1] == cb[4] && cb[4] == cb[7]){
		return true;
	}	
	
	if(cb[1] != "" && cb[1] == cb[5] && cb[5] == cb[9]){
		return true;
	}	
	
	if(cb[2] != "" && cb[2] == cb[5] && cb[5] == cb[8]){
		return true;
	}	
	
	if(cb[3] != "" && cb[3] == cb[6] && cb[6] == cb[9]){
		return true;
	}	
	
	if(cb[3] != "" && cb[3] == cb[5] && cb[5] == cb[7]){
		return true;
	}	
	
	if(cb[4] != "" && cb[4] == cb[5] && cb[5] == cb[6]){
		return true;
	}	
	
	if(cb[7] != "" && cb[7] == cb[8] && cb[8] == cb[9]){
		return true;
	}	
	
	
}//checkWin

//change the visiblity of the lightbox
function changeVisibility(divId){
	let elem = document.getElementById(divId);
	
	//if element exists, i is considered true
	if(elem){
		elem.className = (elem.className == 'hidden') ? 'unhidden' : 'hidden'; 
	}//if
}//changeVisibilty

//display message in lightbox
function showLightBox(message, message2){
	
	document.getElementById("message").innerHTML = message;
	document.getElementById("message2").innerHTML = message2;

	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
}

//close lightbox
function continueGame(){
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
	
	if(gameStatus != ""){
		changeVisibility("controls");
		changeVisibility("newbutton");
	}//if
}

function computerTakeTurn(){
	let idName = "";
	
	console.log(numTurns);
	if(numTurns == 1){
		if(document.getElementById("five").innerHTML == ""){
			document.getElementById("five").innerHTML = currentPlayer;
			return;
		}//if
		randomBox();
		return;
	}//if turn 1

	if(numTurns == 3 || numTurns == 5 || numTurns == 7){

		for(i = 0; i < 9; i++){
			
			idName = idNames[i];
			
			console.log(idName);
			if (document.getElementById(idName).innerHTML == ""){
				document.getElementById(idName).innerHTML = currentPlayer;

				if(checkWin()){//checks if box with character in it wins game
					return;
				}//if
				document.getElementById(idName).innerHTML = "";//reset 

			}//if
		}//for

		for(i = 0; i < 9; i++){
		
			idName = idNames[i];
			
			if (document.getElementById(idName).innerHTML == ""){
				document.getElementById(idName).innerHTML = "X";

				if(checkWin()){
					document.getElementById(idName).innerHTML = currentPlayer;//block X's possible win
					return;
				}//if
				document.getElementById(idName).innerHTML = "";//reset id

			}//if

		}//for loop

		randomBox();
		return;

	}//if turns 3, 5, 7

}//computerTakeTurn

//prevents character input for time
function inputPause(){
	changeVisibility("controls");
	setTimeout(function(){changeVisibility("controls");},250)
}//inputPause

//chooses a random box to enter character.
function randomBox(){ 
	let idName = "";

	do{
		let rand = parseInt(Math.random()*9) + 1;//1-9
		idName = idNames[rand-1];
		
		if (document.getElementById(idName).innerHTML == ""){
			document.getElementById(idName).innerHTML = currentPlayer;
			break;
		}//if
	}while(true);

}//randomBox
