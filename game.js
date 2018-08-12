// Set up canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Get the width and height from the canvas element
var width = canvas.width;
var height = canvas.height;

// Work out the width and height in blocks
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// Set score to 0
var score = 0;

// Timeout ID used for the timeout in the animation
var timeoutId = null;

// Animation time, reduced every time when the snake eats an apple
var animationTime = 100;
var animationSpeed = 5;

var directions = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};
var config = {
	firebase: {
		apiKey: "AIzaSyBeOs9pEuf4dDRLoiPdBdYXJQOCjk_oljk",
		authDomain: "project1-83ca1.firebaseapp.com",
		databaseURL: "https://project1-83ca1.firebaseio.com"
	}
};
firebase.initializeApp(config.firebase);
db = firebase.database();
game_db = db.ref("/game_db/");

//Check and Create Player
is_check_user = true;
str_user = 'player';
index_user = 1;
init_program = false;
snake_color = [];
for(i_color = 0; i_color < 10; i_color++){
	snake_color.push(getRandomColor());
}
var data, data_check;
var xRef, yRef;

function Check_And_Create_Player(){
	game_db.on("value", function(snap) {
    data = snap.val();

		if(init_program == false){
			init_program = true;
			//console.log(data[str_user_check]);
			while(is_check_user){
				str_user_check = str_user + index_user.toString();
				try{
					data_check = data[str_user_check];
				}
				catch(err){
					data_check = undefined;
				}

				//console.log('check data');
				//console.log(data_check);

				if(data_check == undefined){
					//console.log('undefined');
					is_check_user = false;
					//console.log("/game_db/" + str_user_check);
					player_db = db.ref("/game_db/" + str_user_check);
				}
				else {
					index_user++;
				}
			}
			//console.log('Finish');
			Program();
		}
		else {
			//console.log(data[str_user_check]);
			is_update_display = true;
			index_display = 1;
			ctx.clearRect(0, 0, width, height);
			while(is_update_display){
				str_user_get = str_user + index_display.toString();
				try{
					data_display = data[str_user_get];
				}
				catch(err){
					data_display = undefined;
					break;
				}

				if(data_display !== undefined){
					index_display++;

					//console.log(data_display['x']);
					//console.log(data_display['y']);

					data_display_x = data_display['x'].split(',');
					data_display_y = data_display['y'].split(',');

					//console.log(data_display_x);
					//console.log(data_display_y);


					len_snake = data_display_x.length;
					for(i_display = 0; i_display < len_snake; i_display++){
						ctx.fillStyle = snake_color[index_display];
						var x_display = parseInt(data_display_x[i_display])*blockSize;
						var y_display = parseInt(data_display_y[i_display])*blockSize;
						ctx.fillRect(x_display, y_display, blockSize, blockSize);
						drawBorder();
					}
				}
				else{
					break;
				}
			}
		}
	});
}

Check_And_Create_Player();

//Can cai tien update ca 2 thanh phan x va y
function update_value(x_value, y_value){
	xRef.transaction(function(value1, value2) {
		 return x_value;
	});
	yRef.transaction(function(value1, value2) {
		 return y_value;
	});
}

function Program(){
	xRef = player_db.child('x');
	yRef = player_db.child('y');

	var presenceRef = db.ref(".info/connected");
	presenceRef.on("value", function(snap) {
			if (snap.val()) {
					player_db.onDisconnect().remove();
			}
	});




	// Create the snake and apple objects


	function main(){
		//ctx.clearRect(0, 0, width, height);
		snake.move(apple);
		//snake.draw();
		//drawBorder();
	}

	setInterval(main, 200);
}




/*
var xRef = par.child('x');
var yRef = par.child('y');
function update_value(x_value, y_value){
	xRef.transaction(function(value1, value2) {
		 return x_value;
	});
	yRef.transaction(function(value1, value2) {
		 return y_value;
	});
}

function loaddat(){
	var callback = function(snap){
		var data = snap.val();
		//console.log('Load dat');
		console.log(snap.key);
		console.log(data);
	}

	db.ref('/game_db/').limitToLast(100).on('child_added',callback);
	db.ref('/game_db/').limitToLast(100).on('child_changed',callback);
}
loaddat();

var presenceRef = db.ref(".info/connected");
presenceRef.on("value", function(snap) {
		if (snap.val()) {
				par.onDisconnect().remove();
		}
});


var randomName = function () {
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
};

// Draws the border of the gaming field
var drawBorder = function () {
	ctx.fillStyle = 'Gray';
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};


// Shows the player's current score on the top left corner
var drawScore = function () {
	ctx.font = '20px Courier';
	ctx.fillStyle = 'Black';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillText('Score: ' + score, blockSize, blockSize);
};

// Called when the game is over, i.e. when the snake hits the wall or runs into itself
var gameOver = function () {
	// Stop the animation
	//clearTimeout(timeoutId);

	// Remove the key down listener
	//$('body').off('keydown');

	ctx.font = '60px Courier';
	ctx.fillStyle = 'Black';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('Game Over', width / 2, height / 2);
};

// Draws a circle
var circle = function (x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);

	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
};


var Block = function (col, row) {
	this.col = col;
	this.row = row;
};


// Draws a square in a particular block on the grid
Block.prototype.drawSquare = function (color) {
	var x = this.col * blockSize;
	var y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};

// Draws a circle in a particular block on the grid
Block.prototype.drawCircle = function (color) {
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;

	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};

// Checks If two blocks (this and otherBlock) have the same col and row props, then they are in the same place
Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};


var Snake = function () {
	this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
	this.direction = 'right';
	this.nextDirection = 'right';
};

// Draws the sn ake by looping through each of the blocks in its segments array calling drawSquare method
Snake.prototype.draw = function () {
	this.segments[0].drawSquare('Green');
	for (var i = 1; i < this.segments.length; i++) {
		this.segments[i].drawSquare('Blue');
		if (i % 2) {
			this.segments[i].drawSquare('Yellow');
		}
	}
};

Snake.prototype.move = function () {
	var head = this.segments[0];
	var newHead = null;

	this.direction = this.nextDirection;

	if (this.direction === 'right') {
		newHead = new Block(head.col + 1, head.row);
	} else if (this.direction === 'down') {
		newHead = new Block(head.col, head.row + 1);
	} else if (this.direction === 'left') {
		newHead = new Block(head.col - 1, head.row);
	} else if (this.direction === 'up') {
		newHead = new Block(head.col, head.row - 1);
	}

	try{
		if (this.checkCollision(newHead)) {
			gameOver();
			is_run = false;
			return;
		}
	}
	catch(err){
		//console.log(err);
	}

	this.segments.unshift(newHead);

	if (newHead.equal(apple.position)) {
		score++;
		apple.move();
		animationTime -= animationSpeed;
	} else {
		this.segments.pop();
	}

	//console.log(this.segments.length);
	//console.log('Coll: ' + this.segments[0].col);
	str_x = this.segments[0].col.toString();
	str_y = this.segments[0].row.toString();
	for(i = 1; i < this.segments.length; i++){
		str_x = str_x + ',' + this.segments[i].col.toString();
		str_y = str_y + ',' + this.segments[i].row.toString();
	}
	update_value(str_x, str_y);
	//console.log(str_x);
};


Snake.prototype.checkCollision = function (head) {
	var leftCollision = (head.col === 0);
	var topCollision = (head.row === 0);
	var rightCollision = (head.col === widthInBlocks - 1);
	var bottomCollision = (head.row === heightInBlocks - 1);

	var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
	var selfCollision = false;

	for (var i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true;
		}
	}

	return wallCollision || selfCollision;
};


Snake.prototype.setDirection = function (newDirection) {
	if (this.direction === 'up' && newDirection === 'down') {
		return;
	} else if (this.direction === 'right' && newDirection === 'left') {
		return;
	} else if (this.direction === 'down' && newDirection === 'up') {
		return;
	} else if (this.direction === 'left' && newDirection === 'right') {
		return;
	}

	this.nextDirection = newDirection;
};

// Apple object
var Apple = function () {
	this.position = new Block(10, 10);
};

// Draws the apple using drawCircle method
Apple.prototype.draw = function () {
	this.position.drawCircle('LimeGreen');
};

// Moves the apple to a random new position within the game area, that is any block on the canvas other than the border
Apple.prototype.move = function () {
	// Prevent positioning the apple to a block that part of the snake is already occupying
	for (var i = 0; i < snake.segments.length; i++) {
		while (this.position.equal(snake.segments[i])) {
			var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
			var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
			this.position = new Block(randomCol, randomRow);
		}
	}
};

// Create the snake and apple objects
var snake = new Snake();
var apple = new Apple();

var is_run = false;
var gameLoop = function () {
	if(is_run){
		ctx.clearRect(0, 0, width, height);
		drawScore();
		snake.move();
		//snake.draw();
		apple.draw();
		drawBorder();
	}

	timeoutId = setTimeout(gameLoop, animationTime);
};

// Start the game
gameLoop();

// Keydown event handler for user interacton
$('body').keydown(function (event) {
	var keypress = event.keyCode;
	//console.log(keypress);
	if (keypress !== undefined) {
		if (keypress == 32){
			//console.log('space');
			is_run = true;
			snake = new Snake();
			apple = new Apple();
			score = 0;
		}
		else{
			if(keypress >= 37 && keypress <=40 && is_run == true){
				var dir = directions[keypress];
				snake.setDirection(dir);
			}
		}
	}
});*/
