//global variables
var speedOfPaddle1 = 0; //set speed of paddle
var positionOfPaddle1 = document.getElementById("paddle1").offsetTop; //position of paddle1
const startPositionOfPaddle1 = document.getElementById("paddle1").offsetTop; //starting position for paddle1
var speedOfPaddle2 = 0; // set speed paddle 2
var positionOfPaddle2 = document.getElementById("paddle2").offsetTop; //position of paddle2
const startPositionOfPaddle2 = document.getElementById("paddle2").offsetTop; //start position for paddle2

const originalPaddleHeight = document.getElementById("paddle1").offsetHeight;//normal paddle height
const paddleWidth = document.getElementById("paddle1").offsetWidth; //normal paddle width

const gameBoardHeight = document.getElementById("gameBoard").offsetHeight; //gameheight
const gameBoardWidth = document.getElementById("gameBoard").offsetWidth;//gamewidth

const originalBallHeight = document.getElementById("ball").offsetHeight;//normal ball height
const startTopPositionOfBall = document.getElementById("ball").offsetTop; //starting position for ball
const startLeftPositionOfBall = document.getElementById("ball").offsetLeft; //starting position for ball

var paddleHeight = originalPaddleHeight; //paddle height
var ballHeight = originalBallHeight; //ball height

var topPositionOfBall = startTopPositionOfBall;//position of ball y 
var leftPositionOfBall = startLeftPositionOfBall;//position of ball x
var topSpeedOfBall; //ball vertical speed
var leftSpeedOfBall; //ball horizontal speed
var speedMultiplier = 1; //speed multiplier

var bounce = new sound("bounce.wav"); //bounce sound
var lose = new sound("balloff.wav"); //point sound

var score1 = 0;//p1 score
var score2 = 0;//p2 score
var timer = 0;//timer

//used to control game start/stop and timer start/stop
var controlPlay;
var controlTime;

//move paddles
document.addEventListener('keydown', function(event) {
	if(event.keyCode == 87 || event.which == 87){
		speedOfPaddle1 = -10;
	}//if

	if(event.keyCode == 83 || event.which == 83){
		speedOfPaddle1 = 10;
	}//if
	if(event.keyCode == 38 || event.which == 38){
		speedOfPaddle2 = -10;
	}//if

	if(event.keyCode == 40 || event.which == 40){
		speedOfPaddle2 = 10;
	}//if
	

});//event listener

//stop paddles
document.addEventListener('keyup', function(event) {
	if(event.keyCode == 87 || event.which == 87){
		speedOfPaddle1 = 0;

	}//if

	if(event.keyCode == 83 || event.which == 83){
		speedOfPaddle1 = 0;
	}//if
	if(event.keyCode == 38 || event.which == 38){
		speedOfPaddle2 = 0;

	}//if

	if(event.keyCode == 40 || event.which == 40){
		speedOfPaddle2 = 0;
	}//if


});//event listener

//object constructor to play sounds
//https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
} //sound


function startBall(){
	let directionX = 1;//horizontal direction
	let directionY = 1;//vertical direciton
	topPositionOfBall = startTopPositionOfBall;
	leftPositionOfBall = startLeftPositionOfBall;

	if(Math.random() < 0.5){
		directionX = 1;
	} else {
		directionX = -1;
	}//else

	if(Math.random() < 0.5){
		directionY = 1;
	} else {
		directionY = -1;
	}//else

	topSpeedOfBall = (directionY * (Math.random() * 2 + 3)) * speedMultiplier;
	leftSpeedOfBall = (directionX * (Math.random() * 2 + 3)) * speedMultiplier;
}//startBall

//update locations of paddle and ball
function show(){

	//update positions
	positionOfPaddle1 += speedOfPaddle1;
	positionOfPaddle2 += speedOfPaddle2;
	topPositionOfBall += topSpeedOfBall;
	leftPositionOfBall += leftSpeedOfBall;

	//stop paddle1 from leaving top of gameboard
	if(positionOfPaddle1 <= 0){
		positionOfPaddle1 = 0;
	}//if
	
	//stop paddle1 from leaving bottom of gameboard
	if(positionOfPaddle1 >= gameBoardHeight - paddleHeight){
		positionOfPaddle1 = gameBoardHeight - paddleHeight;

	}//if

	//stop paddle2 from leaving top of gameboard
	if(positionOfPaddle2 <= 0){
		positionOfPaddle2 = 0;
	}//if
	
	//stop paddle2 from leaving bottom of gameboard
	if(positionOfPaddle2 >= gameBoardHeight - paddleHeight){
		positionOfPaddle2 = gameBoardHeight - paddleHeight;

	}//if

	//if ball hits sides, change direction
	if(topPositionOfBall <= 0 || topPositionOfBall >= gameBoardHeight - ballHeight){
		topSpeedOfBall *= -1;
	}//if

	if(leftPositionOfBall <= paddleWidth) {

	//change direction if ball hits left side of gameboard
		if(topPositionOfBall > positionOfPaddle1 && topPositionOfBall < positionOfPaddle1 + paddleHeight){
			bounce.play();
			leftSpeedOfBall *= -1;
		}else{
			score2++;
			lose.play();
			startBall();
			speedMultiplier = speedMultiplier + 0.1;
		}//else
	}//if

	if(leftPositionOfBall >= gameBoardWidth - paddleWidth - ballHeight) {

	//change direction if ball hits right side of gameboard
		if(topPositionOfBall > positionOfPaddle2 && topPositionOfBall < positionOfPaddle2 + paddleHeight){
			bounce.play();
			leftSpeedOfBall *= -1;
		}else{
			score1++;
			lose.play();
			startBall();
			speedMultiplier = speedMultiplier + 0.1;
		}//else
	}//if;
	document.getElementById("timer").innerHTML = "Time: " + timer + "s";
	document.getElementById("speed").innerHTML = "Multiplier: " + ((Math.round(speedMultiplier * 10))/10) + "x";
	document.getElementById("paddle1").style.top = positionOfPaddle1 + "px";
	document.getElementById("paddle2").style.top = positionOfPaddle2 + "px";
	document.getElementById("ball").style.top = topPositionOfBall + "px";
	document.getElementById("ball").style.left = leftPositionOfBall + "px";
	document.getElementById("score1").innerHTML = score1;
	document.getElementById("score2").innerHTML = score2;

}//show

//timer
function gameTime(){
	timer++;
	if(timer%10 == 0){
		specials();//calls specials every 10 seconds
	}//if
}//gameTime

//resume game
function resumeGame(){
	if(!controlPlay){
		controlPlay = window.setInterval(show, 1000/60);
		controlTime = window.setInterval(gameTime, 1000);
	}//if
}//resumeGame

//to pause the game and timer
function pauseGame(){
	window.clearInterval(controlPlay);
	window.clearInterval(controlTime);
	controlPlay = false;

}//pauseGame

//starts the game
function startGame(){

	//reset score, ball, and paddles and speed
	score1 = 0;
	score2 = 0;
	positionOfPaddle2 = startPositionOfPaddle2;
	positionOfPaddle1 = startPositionOfPaddle1;
	speedMultiplier = 1;
	timer = 0;
	resetElements();

	startBall();
	document.getElementById('startGame').className = 'hidden';
	document.getElementById('lightbox').className = 'hidden';
	document.getElementById('boundaryMessage').className = 'hidden';
	document.getElementById('x').className = 'unhidden';

	if(!controlPlay){
		controlPlay = window.setInterval(show, 1000/60);
		controlTime = window.setInterval(gameTime, 1000);
	}//if
}//startGame

//stop game
function stopGame(){
	pauseGame();

	//show lightbox with score
	let message1 = "Tie Game";
	let message2 = "Close to continue";
	let point1 = " points";
	let point2 = " points";

	if(score2 == 1){
		point2 = " point";
	} else if(score1 == 1){
		point1 = " point";
	}//if
	if(score2 > score1){
		message1 = "Player 2 wins with " + score2 + point2 + "!";
		message2 = "Player 1 lost with " + score1 + point1 + "!";
	} else if(score1 > score2){
		message1 = "Player 1 wins with " + score1 + point1 + "!";
		message2 = "Player 2 lost with " + score2 + point2 + "!";
	}//else if

	showLightBox(message1, message2)
}//stopGame

//function that picks 1 random event to happen
function specials(){
	let rand = Math.floor(Math.random() * 4);//0-4

	//sets paddles to double the height
	if(rand == 1){
		document.getElementById("paddle1").style.height = "300px";
		document.getElementById("paddle2").style.height = "300px";
		paddleHeight = document.getElementById("paddle1").offsetHeight;
		document.getElementById("specials").innerHTML = "Mods: 2x Paddles";

	}//if

	//sets paddles to half the height
	else if(rand == 2){
		document.getElementById("paddle1").style.height = "75px";
		document.getElementById("paddle2").style.height = "75px";
		paddleHeight = document.getElementById("paddle1").offsetHeight;
		document.getElementById("specials").innerHTML = "Mods: Half Paddles";

	}//else if

	//sets ball to double the size
	else if(rand == 3){
		document.getElementById("ball").style.height = "50px";
		document.getElementById("ball").style.width = "50px";
		ballHeight = document.getElementById("ball").offsetHeight;
		document.getElementById("specials").innerHTML = "Mods: Med Ball";

	}//else if

	//sets ball to triple the size
	else{
		document.getElementById("ball").style.height = "75px";
		document.getElementById("ball").style.width = "75px";
		ballHeight = document.getElementById("ball").offsetHeight;
		document.getElementById("specials").innerHTML = "Mods: Big Ball";
	}//else

	window.setTimeout(resetElements, 5000);//resets to normal after 5 sec
}//specials

//resets paddles and balls to original size + specials div
function resetElements(){
	document.getElementById("paddle1").style.height = "150px";
	document.getElementById("paddle2").style.height = "150px";
	document.getElementById("ball").style.width = "25px";
	document.getElementById("ball").style.height = "25px";
	ballHeight = document.getElementById("ball").offsetHeight;
	paddleHeight = document.getElementById("paddle1").offsetHeight;
	document.getElementById("specials").innerHTML = "Mods: None";

}//resetElements

/* start of lightbox code */

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
}//showLightBox

//close lightbox
function continueGame(){
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
	
}//continueGame

/* end of lightbox code */
