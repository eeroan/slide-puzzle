//TODO game reset, theme, difficulty, levels, high score, timer, moves 
init({image:'Koala.jpg', split:3});
var lastPiece;
var emptyCell;
function imageReady(image, callBack) {
	setTimeout(function() {
		if(image.width) callBack({x:image.width, y:image.height});
		else imageReady(image, callBack);
	}, 13);
}
function init(opts) {
	var image = new Image();
	image.src = opts.image;
	imageReady(image, function(board) {
		var boxInfo = {};
		boxInfo.grid = {x:opts.split, y:opts.split};
		boxInfo.size = {x:divideFor('x'), y:divideFor('y')};
		boxInfo.image = opts.image;
		var table = getTable(board, boxInfo);
		initClickEvent(table, boxInfo);
		initKeyEvent(table, boxInfo);
		function divideFor(axis) { return parseInt(board[axis] / boxInfo.grid[axis])};
	});
	}

function initKeyEvent(table, boxInfo) {
	$(document).keyup(function(e) {
		var keyCodes = {LEFT:37, UP:38, RIGHT:39, DOWN:40};
		var movableBox;
		switch(e.keyCode) {
			case keyCodes.LEFT: movableBox = {x:emptyCell.x+1, y:emptyCell.y}; break;
			case keyCodes.UP: movableBox = {x:emptyCell.x, y:emptyCell.y+1}; break;
			case keyCodes.RIGHT: movableBox = {x:emptyCell.x-1, y:emptyCell.y}; break;
			case keyCodes.DOWN: movableBox = {x:emptyCell.x, y:emptyCell.y-1}; break;
		}
		if(!isOutOfBounds(movableBox, boxInfo.grid)) {
			moveBox(movableBox, emptyCell, table, boxInfo);
		}
	});
}
function initClickEvent(table, boxInfo) {
	$('#board').click(function(e) {
		var box = $(e.target);
		if(box.hasClass('piece')) {
			var from = box.data('pos');
			var to = nextToFree(from, boxInfo.grid, table);
			if(to) moveBox(from, to, table, boxInfo)
		}
	});
}
function moveBox(from, to, table, boxInfo) {
	var box = table[from.x][from.y];
	table[to.x][to.y] = box;
	table[from.x][from.y] = null;
	emptyCell = from;
	box.animate(pos(to, boxInfo.size), 300, validate).data('pos', to);
	function validate() { if(isDone(table)) gameCompleted(boxInfo);}
}
function gameCompleted(boxInfo) {
	var end = boxInfo.grid;
	lastPiece.css(pos({x:end.x-1,y:end.y-1}, boxInfo.size));
	$('#board').append(lastPiece);
}
function isDone(table) {
	for(var x in table) {
		for(var y in table[x]) {
			var slot = table[x][y];
			if(slot) {
				var box = slot.data('origPos');
				if(box.x != x || box.y != y) {
					return false;
				}
			}
		}
	}
	return true;
}
function nextToFree(old, grid, table) {
	var x = old.x;
	var y = old.y;
	var sides = [{x:x, y:y+1}, {x:x+1, y:y}, {x:x, y:y-1}, {x:x-1, y:y}];
	for(var i in sides) {
		var freePos = getIfFree(sides[i], grid, table);
		if(freePos) return freePos;
	}
	return null;
}
function getIfFree(side, grid, table) {
	return (isOutOfBounds(side, grid) || table[side.x][side.y] != null) ? null :{x:side.x, y:side.y};
}
function isOutOfBounds(box, grid) {
	return box.x < 0 || box.x >= grid.x || box.y < 0 || box.y >= grid.y;
}
function getTable(boardDim, boxInfo) {
	var board =  getBoard(boardDim);
	var pieces = getPieces(boxInfo);
	var table = [];
	for(var x = 0; x < boxInfo.grid.x; x++) {
		table[x] = [];
		for(var y = 0; y < boxInfo.grid.y; y++) {
			if(pieces.length) {
				var slot = {x:x, y:y};
				var box = pieces.pop().css(pos(slot, boxInfo.size)).data('pos', slot);
				board.append(box);
				table[x][y] = box;
			} else {
				table[x][y] = null;
				emptyCell = {x:x,y:y}
			}
		}
	}
	return table;
}

function getPieces(boxInfo) {
	var pieces = [];
	for(var x = 0; x < boxInfo.grid.x; x++) {
		for(var y = 0; y < boxInfo.grid.y; y++) {
			pieces.push(piece(x, y, boxInfo));
		}
	}
	lastPiece = pieces.pop();
	return pieces;
}

function piece(x,y, boxInfo) {
	return $('<div>').addClass('piece').width(boxInfo.size.x).height(boxInfo.size.y)
	.css('background','url('+ boxInfo.image +') -'+(x*boxInfo.size.x)+'px -'+(y*boxInfo.size.y)+'px')
	.data('origPos', {x:x, y:y});
}
function pos(slot, size) { return {left:(slot.x*size.x)+'px',top:(slot.y*size.y)+'px'}}
function getBoard(board) {return $("#board").width(board.x).height(board.y);}