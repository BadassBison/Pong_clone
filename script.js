// Code for my version of the classic game Pong

// The arena area
var canvas;
var canvasContext;

// Title font size
var titleSize = 50;
var on = true;

// # of players
var player1Select;
var player2Select;

// player controls
var a;
var x;
var up;
var down;

// difficulty
var easy;
var medium;
var hard;

// Start of the game positions
var ballX = 50;
var ballY = 50;

//Where the paddles are at the start of the game
var paddle1Y = 250;
var paddle2Y = 250;

// X & Y speed positions of the ball
var ballSpeedX = 10;
var ballSpeedY = 10;

// angle of the ball off the paddle
var angle = 0.35;

// Speed of the computers paddle
var computerSpeed = 20;

// Paddle heights
var paddle1Height = window.innerWidth/9.7;
var paddle2Height = window.innerWidth/9.7;

// ball size
var ballSize = 15;

// Constant for the thickness of the paddle
const paddleThickness = window.innerWidth/100;

// # of points to win
var winningScore = 10;

// Scores at the start of the game
var player1Score = 0;
var player2Score = 0;

// to know who won
var playerWin = false;

// Start screen
var showingStartScreen = true;

// Win screen
var showingWinScreen = false;



//-------FUNCTIONS

// function that determines where the mouse y-pos is in the canvas
function calculateMousePos (evt){

	// gets the size of the object (canvas) and its position relative to the viewport
	var rect = canvas.getBoundingClientRect();

	// returns the element that is root to the document
	var root = document.documentElement;

	// gets position relative to how far rect is from the window side and how much you have scrolled
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;

	// grabs x & y values from the position information above
	return{
		x:mouseX,
		y:mouseY
	}
}


// Function to click and restart if someone wins
function handleMouseClick(evt){
	if (showingWinScreen){
		player1Score = 0;
		player2Score = 0;
		ballSpeedX = 10;
		showingWinScreen = false;
	}
}



function keyPush1(evt){
	var i = 0;
	function move1Up(){ paddle1Y = paddle1Y - 8 }
	function move1Down(){ paddle1Y = paddle1Y + 8 }

	evt.preventDefault();

	if(evt.keyCode === 65 && i<1){
			a = setInterval(move1Up, 20);
			i++;
		} else {
			clearInterval(a);
			a = i;
			i = 0;
		}

	if(evt.keyCode === 90  && i<1){
			z = setInterval(move1Down, 20);
			i++;
		} else {
			clearInterval(z);
			z = i;
			i = 0;
		}
}

function keyPush2(evt){
	var i = 0;
	function move2Up(){ paddle2Y = paddle2Y - 8 }
	function move2Down(){ paddle2Y = paddle2Y + 8 }

	evt.preventDefault();

	if(evt.keyCode === 38  && i<1){
			up = setInterval(move2Up, 20);
			i++;
		} else {
			clearInterval(up);
			up = i;
			i = 0;
		}

	if(evt.keyCode === 40  && i<1){
			down = setInterval(move2Down, 20);
			i++;
		} else {
			clearInterval(down);
			down = i;
			i = 0;
		}
}


// function that initiates the game on the load of the window
window.onload = function() {

	// gets the canvas info from the html file
	canvas = document.getElementById("gameCanvas");

	// gets the 2d rendering context and allows us to draw within it
	canvasContext = canvas.getContext("2d");

	// calls the listener function so you can click to restart after someone wins
	canvas.addEventListener("mousedown", handleMouseClick);

	// typical frames per second
	var framesPerSecond = 30;
	var second = 1000; // milliseconds

	// setting a timer interval to 30fps
	setInterval(function (){
		moveEverything();
		drawEverything();
	}, second / framesPerSecond);
}



// Function when the button is clicked on the start screen
function gameStart(){
	player1Select = document.getElementById("1player").checked;
	player2Select = document.getElementById("2player").checked;
	easy = document.getElementById("easy").checked;
	hard = document.getElementById("hard").checked;
	winningScore = 7;

	// when 1 player is selected
	if(player1Select){

		// grabs the y value of the mouse and moves center of paddle to that spot
		canvas.addEventListener("mousemove",
				function(evt){
					var mousePos = calculateMousePos(evt);
					paddle1Y = mousePos.y - (paddle1Height/2);
				});

		// changes made for difficulty
		if (easy) {
			paddle1Height = window.innerWidth/7;
			computerSpeed = 16;
		} else if (hard) {
			paddle1Height = window.innerWidth/13;
			computerSpeed = 24;
		}
	}


	// when 2 player is selected
	if(player2Select){

		// uses keys to move the paddles
		 document.addEventListener("keydown", keyPush1);
		 document.addEventListener("keydown", keyPush2);
	}

	// condtions when the game starts
	showingStartScreen = false;
	document.getElementById("container").className = "closed";
	document.getElementById("start3").className = "closed";
	document.getElementById("start4").className = "closed";
	ballReset();
	player1Score = 0;
	player2Score = 0;
}


// Functions to remove and add the difficulty settings if 1 or 2 player is selected
function removeDifficulty(evt){
	document.getElementById("start2").className = "closed";
}
function addDifficulty(evt){
	document.getElementById("start2").className = "open";
}


// function that resets the ball to the center when a point is scored
function ballReset(){
	ballSpeedX = -ballSpeedX*1.1;
	ballX = canvas.width/2
	bally = canvas.height/2
	angle = 0.35;
	ballSpeedY = 0;

	// when the game is won
	if (player1Score >= winningScore) {
		playerWin = true;
		showingWinScreen = true;
	}
	if (player2Score >= winningScore){
		showingWinScreen = true;
	}
}


// Function for AI left paddle
function computerMoveLeft (){
	var paddle1YCenter = paddle1Y + (paddle1Height/2);
	if (paddle1YCenter > ballY + 35){
		paddle1Y -= computerSpeed
	} else if (paddle1YCenter < ballY - 35){
		paddle1Y += computerSpeed
	}
}
// Function for AI right paddle
function computerMoveRight (){
	var paddle2YCenter = paddle2Y + (paddle2Height/2);
	if (paddle2YCenter > ballY + 35){
		paddle2Y -= computerSpeed
	} else if (paddle2YCenter < ballY - 35){
		paddle2Y += computerSpeed
	}
}



// -------- Start of the two main function

// Function to move everything in the game
function moveEverything (){

	// var to move right paddle when canvas is adjusted
	var paddleHitRight = canvas.width - 24;

	// y axis limits for the ball
	if (ballY >= canvas.height){
		ballSpeedY = -ballSpeedY;
		ballY -= 5;
	}
	if (ballY <= 0){
		ballSpeedY = -ballSpeedY;
		ballY += 5;

	// y axis limtis for the paddles
	}
	if (paddle1Y < 0){
		paddle1Y = 0;
	}
	if (paddle1Y > canvas.height - paddle1Height){
		paddle1Y = canvas.height - paddle1Height;
	}
	if (paddle2Y < 0){
		paddle2Y = 0;
	}
	if (paddle2Y > canvas.height - paddle2Height){
		paddle2Y = canvas.height - paddle2Height;
	}

	// pause the play if the win screen is showing
	if(showingWinScreen){
		return; // end function here if true
	}

	// movement of the ball
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	// when the ball reaches the goal
	if (ballX > canvas.width){
		player1Score++; // must be before ballReset()
		ballReset();
	}
	if (ballX < 0){
		player2Score++; // must be before ballReset()
		ballReset();
	}


	// check if player 1 paddle hits ball
	if (ballX < 24){
		if (ballY > paddle1Y &&
			ballY < paddle1Y + paddle1Height){
		ballSpeedX = -ballSpeedX;
		angle *= 1.1;

		// adjusts the angle of the ball depending on where it hits the paddle
		var deltaY = ballY - (paddle1Y+paddle1Height/2);
		ballSpeedY = deltaY * angle;
		}
	}


	// check if player 2 paddle hits ball
	if (ballX > paddleHitRight){
		if (ballY > paddle2Y &&
			ballY < paddle2Y + paddle2Height){
		ballSpeedX = -ballSpeedX;
		angle *= 1.1;

		// adjusts the angle of the ball depending on where it hits the paddle
		var deltaY = ballY - (paddle2Y+paddle2Height/2);
		ballSpeedY = deltaY * angle;
		}
	}


	// start screen AI
	if (showingStartScreen){
	computerMoveRight();
	computerMoveLeft();
		if (player1Score == 9 || player2Score == 9){
			player1Score = 0;
			player2Score = 0;
			ballSpeedX = 10;
		}
	}
	// AI for 1player
	if (player1Select){
		computerMoveRight();
	}
}


// function to draw everything in the arena (canvas)
function drawEverything (){

	// keeps computers paddle in the right spot even if the canvas is resized
	var paddle2Position = (canvas.width - 22);

	//make the canvas the size of the window
	document.getElementById("gameCanvas").width = window.innerWidth - 20;
	document.getElementById("gameCanvas").height = window.innerHeight - 20;

	// color of arena (x-pos, y-pos, width, height, color)
	colorRect(0, 0, canvas.width, canvas.height, "#60CC14");

	// arena circles
	arenaDetails(0, canvas.height/2, canvas.width/6.3, "#0DFF92", 4.7, 0.5*Math.PI, 7, false);
	arenaDetails(canvas.width/2, canvas.height/2, canvas.width/6.3, "#0DFF92", 0, 2*Math.PI, 7, true);
	arenaDetails(canvas.width, canvas.height/2, canvas.width/6.3, "#0DFF92", 4.7, 0.5*Math.PI, 7, true);

	// center line
	colorRect(canvas.width/2, 0, 7, canvas.height, "#0DFF92");

	// player 1 paddle
	colorRect(10, paddle1Y, paddleThickness, paddle1Height, "white");

	// player 2 paddle
	colorRect(paddle2Position, paddle2Y, paddleThickness, paddle2Height, "white");

	// scores
	canvasContext.font="60px Georgia"
	canvasContext.fillText(player1Score, 120, 100);
	canvasContext.fillText(player2Score, canvas.width-170, 100);

	// Title at start
	if (showingStartScreen){
		var gradient=canvasContext.createLinearGradient(0,0,canvas.width,0);
		gradient.addColorStop("0.3","magenta");
		gradient.addColorStop("0.5","yellow");
		gradient.addColorStop("0.7","red");
		canvasContext.font="120px Fantasy";
		canvasContext.fillStyle=gradient;
		canvasContext.fillText("PONG", canvas.width/2 - 180, 260);
	}

	// Show winning message
	if(showingWinScreen){

		//make gradient for winning message
		var gradient=canvasContext.createLinearGradient(0,0,canvas.width,0);
		gradient.addColorStop("0.3","magenta");
		gradient.addColorStop("0.5","yellow");
		gradient.addColorStop("0.7","red");

		if(playerWin){
			canvasContext.font="60px Georgia";
			canvasContext.fillStyle=gradient;
			canvasContext.fillText("Player 1 Wins!", canvas.width/2 - 190, canvas.height/2);
		} else {
			canvasContext.font="60px Georgia";
			canvasContext.fillStyle=gradient;
			canvasContext.fillText("Player 2 Wins!", canvas.width/2 - 230, canvas.height/2);
		}
		return;
	}

	// the ball
	colorBall(ballX, ballY, ballSize, "white");
}



//Cleaner Functions

	// way to clean up the ball functions
	function colorBall (centerX, centerY, radius, drawColor){
		canvasContext.fillStyle = drawColor;
		canvasContext.beginPath();
		canvasContext.arc(centerX, centerY, radius, 0, 2*Math.PI, true);
		canvasContext.fill();
	}

	function arenaDetails (centerX, centerY, radius, drawColor, radians, pie, lineWidth, left){
		canvasContext.strokeStyle = drawColor;
		canvasContext.beginPath();
		canvasContext.arc(centerX, centerY, radius, radians, pie, left);
		canvasContext.lineWidth = lineWidth;
		canvasContext.stroke();
	}

	// Combines these 2 lines. See function drawEverything()
	function colorRect (topX, leftY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(topX, leftY, width, height, drawColor);
}
