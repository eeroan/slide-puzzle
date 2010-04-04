//TODO cursor css, game reset, theme, difficulty, levels 
init({split:4});

function init(opts) {
	var board = {x:600, y:450};
	var boxInfo = {};
	boxInfo.grid = {x:opts.split, y:opts.split};
	boxInfo.size = {x:divideFor('x'), y:divideFor('y')};
	initClickEvent(getTable(board, boxInfo), boxInfo);
	initKeyEvent();
	function divideFor(axis) { return parseInt(board[axis] / boxInfo.grid[axis])};
}

function initKeyEvent() {
	$(document).keyup(function(e) {
		var keyCodes = {LEFT:37, UP:38, RIGHT:39, DOWN:40};
		switch(e.keyCode) {
			case keyCodes.LEFT:
				
			break;
			case keyCodes.UP:
			
			break;
			case keyCodes.RIGHT:
			
			break;
			case keyCodes.DOWN:
			
			break;
		}
	});
}
function initClickEvent(table, boxInfo) {
	$('#board').click(function(e) {
		var box = $(e.target);
		if(box.hasClass('piece')) {
			var old = box.data('pos');
			var free = nextToFree(old, boxInfo.grid, table);
			if(free) {
				table[free.x][free.y] = table[old.x][old.y];
				table[old.x][old.y] = null;
				box.animate(pos(free, boxInfo.size)).data('pos', free);
			}
		}
	});
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
			}
		}
	}
	return table;
}

function getPieces(boxInfo) {
	var pieces = [];
	for(var x = 0; x < boxInfo.grid.x; x++) {
		for(var y = 0; y < boxInfo.grid.y; y++) {
			pieces.push(piece(x, y, boxInfo.size));
		}
	}
	pieces.pop();
	return pieces;
}

function piece(x,y, size) {
	return $('<div>').addClass('piece').width(size.x).height(size.y)
	.css('background-position','-'+(x*size.x)+'px -'+(y*size.y)+'px');
}
function pos(slot, size) { return {left:(slot.x*size.x)+'px',top:(slot.y*size.y)+'px'}}
function getBoard(board) {return $("#board").width(board.x).height(board.y);}