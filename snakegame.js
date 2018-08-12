var drawBorder = function () {
	ctx.fillStyle = 'Gray';
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};

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
  /*
	if (newHead.equal(apple.position)) {
		score++;
		apple.move();
		animationTime -= animationSpeed;
	} else {
		this.segments.pop();
	}*/
  this.segments.pop();

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

var is_run = true;
var snake = new Snake();
var apple = new Apple();

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
});
