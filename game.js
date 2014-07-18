var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasGrid = document.getElementById('canvasGrid');
var ctxGrid = canvasGrid.getContext('2d');
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var bgDrawX1 = 0;
var bgDrawX2 = 1600;

var myGrid = new Grid();
						
var tileImgs = new Array();


// Images ----------------------- //
tileImgs[0] = new Image();
tileImgs[0].src = 'images/2.png';
tileImgs[1] = new Image();
tileImgs[1].src = 'images/4.png';
tileImgs[2] = new Image();
tileImgs[2].src = 'images/8.png';
tileImgs[3] = new Image();
tileImgs[3].src = 'images/16.png';
tileImgs[3].addEventListener('load', init, false);
//---------------------------------//


// Main Functions -----------------------------------------------------------------//

function init() {
    myGrid.addTile();
	myGrid.addTile();
	myGrid.draw();
    document.addEventListener('keydown', checkKeyDown, false);
 //   document.addEventListener('keyup', checkKeyUp, false);
}

function update() {	
	myGrid.move();
	myGrid.move();
	myGrid.move();
	myGrid.checkCombine();
	myGrid.move();
	myGrid.stopMoving();
	myGrid.clrGrid();
	myGrid.addTile();
	myGrid.draw();
}

// end of main functions

//------------------------------------------------------------//


// grid functions --------------------------------------------//

function Grid() {
	this.width = 5;
	this.height = 5;
	this.maxX = 4;
	this.maxY = 4;
    this.tileWidth = 1000;
    this.tileHeight = 1000;    
    this.tileDrawWidth = gameWidth / this.width;
	this.tileDrawHeight = gameHeight / this.height;
	// moving -> 0 = not moving, 1 = up, 2 = down, 3 = left, 4 = right
	this.moving = 0;
	// tiles -> 0 = no tile, 1 = "2", 2 = "4" ...
	this.tiles =  [0, 0, 0, 0, 0, 
				  0, 0, 0, 0, 0, 
				  0, 0, 0, 0, 0, 
				  0, 0, 0, 0, 0, 
			      0, 0, 0, 0, 0];
}

Grid.prototype.addTile = function() {
	if (this.checkGridFull() == true){
		window.alert("YOU LOSE!");
		return;
	}
	// type of tile to spawn -> 1 = "2", 2 = "4"
	var type = Math.floor(Math.random() * 2) + 1;
	while(true){
		var pos = Math.floor(Math.random() * this.tiles.length);
		if (this.tiles[pos] == 0){
			this.tiles[pos] = type;
			break;
		}
	}	
}

Grid.prototype.checkGridFull = function() {
	for (var i = 0; i < this.tiles.length; i++){
		if (this.tiles[i] == 0){
			return false;
		}
	}
	return true;
}

Grid.prototype.getAdjacentTilePos = function(pos, adj) {
	// pos -> current position
	// adj -> 1 = above, 2 = below, 3 = left, 4 = right
	var gridPosY = this.getGridPosY(pos);
	var gridPosX = this.getGridPosX(pos);
	switch(adj){
		case 1: // get position of tile above
			gridPosY--;	
			break;
		case 2: // get position of tile below
			gridPosY++;
			break;
		case 3: // get position of tile to the left
			gridPosX--;
			break;
		case 4: // get position of the tile to the right
			gridPosX++;
			break;
		default:
			return -1;
	}
	if (gridPosY > this.maxY || gridPosY < 0 || gridPosX > this.maxX || gridPosX < 0){
		return -1;
	}
	return gridPosY * 5 + gridPosX;
}

Grid.prototype.getGridPosX = function(pos) {
	return pos - (Math.floor(pos / this.height) * this.width);
}

Grid.prototype.getGridPosY = function(pos){
	return Math.floor(pos / this.height);
}

Grid.prototype.draw = function() {
	for(var i=0; i < this.tiles.length; i++){
		if (this.tiles[i] > 0){
			var gridPosY = Math.floor(i / 5);
			var gridPosX = i - (5 * gridPosY);
			ctxGrid.drawImage(tileImgs[this.tiles[i] - 1], 0, 0, this.tileWidth, this.tileHeight, this.tileDrawWidth * gridPosX, this.tileDrawHeight * gridPosY, this.tileDrawWidth, this.tileDrawHeight);
		}
	}
};

Grid.prototype.clrGrid = function() {	
	ctxGrid.clearRect(0, 0, gameWidth, gameHeight);
}

Grid.prototype.move = function() {
	for (var i=0; i < this.tiles.length; i++) {
		var gridPosY = this.getGridPosY(i);
		var gridPosX = this.getGridPosX(i);
		switch(this.moving){
			case 1: // moving up
				var above = this.getAdjacentTilePos(i, 1);
				if (above != -1 && this.tiles[i] > 0 && this.tiles[above] == 0){
					this.tiles[above] = this.tiles[i];
					this.tiles[i]=0;
				}
				break;
			case 2: // moving down
				var below = this.getAdjacentTilePos(i, 2);
				if (below != -1 && this.tiles[i] > 0 && this.tiles[below] == 0){
					this.tiles[below] = this.tiles[i];
					this.tiles[i]=0;
				}
				break;
			case 3: // moving left
				var left = this.getAdjacentTilePos(i, 3);
				if (left != -1 && this.tiles[i] > 0 && this.tiles[left] == 0){
					this.tiles[left] = this.tiles[i];
					this.tiles[i]=0;
				}
				break;
			case 4: // moving right
				var right = this.getAdjacentTilePos(i, 4);
				if (left != -1 && this.tiles[i] > 0 && this.tiles[right] == 0){
					this.tiles[right] = this.tiles[i];
					this.tiles[i]=0;
				}
		}
	}
}

Grid.prototype.stopMoving = function(){
	this.moving = 0;
}

Grid.prototype.checkCombine = function() {	
	for (var i=0; i < this.tiles.length; i++) {
		// check from front to back when moving up or left
		var gridPosY = this.getGridPosY(i);
		var gridPosX = this.getGridPosX(i);
		switch(this.moving) {
			case 1: // moving up
				var above = this.getAdjacentTilePos(i, 1);
				if (above != -1 && this.tiles[i] > 0 && this.tiles[i] < 4 && this.tiles[above] == this.tiles[i]) {
					this.tiles[above]++;
					this.tiles[i] = 0;
				}
				break;
			case 3: // moving left
				var left = this.getAdjacentTilePos(i, 3);
				if (left != -1 && this.tiles[i] > 0 && this.tiles[i] < 4 && this.tiles[left] == this.tiles[i]) {
					this.tiles[left]++;
					this.tiles[i] = 0;
				}
				break;
		}
	}
		
	for (var i = this.tiles.length - 1; i >= 0; i--) {
		// check from back to front when moving down or right
		var gridPosY = Math.floor(i / 5);
		var gridPosX = i - (5 * gridPosY);
		switch(this.moving) {
			case 2: // moving down
				if (this.tiles[i] > 0 && this.tiles[i] < 4 && gridPosY < 4 && this.tiles[(gridPosY + 1) * 5 + gridPosX] == this.tiles[i]) {
					this.tiles[(gridPosY + 1) * 5 + gridPosX] = this.tiles[i] + 1;
					this.tiles[i] = 0;
				}
				break;
			case 4: // moving right
				if (this.tiles[i] > 0 && this.tiles[i] < 4 && gridPosX < 4 && this.tiles[gridPosY * 5 + gridPosX + 1] == this.tiles[i]) {
					this.tiles[gridPosY * 5 + gridPosX + 1] = this.tiles[i] + 1;
					this.tiles[i] = 0;
				}
				break;
		}
	}
};

// end grid functions

// event functions

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
		myGrid.moving = 1;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
		myGrid.moving = 4;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
		myGrid.moving = 2;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
		myGrid.moving = 3;
        e.preventDefault();
    }
	update();
}

// NOT USED
function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        myGrid.moving = 1;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
		myGrid.moving = 4;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
		myGrid.moving = 2;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
		myGrid.moving = 3;
        e.preventDefault();
    }
	update();
}

// end of event functions