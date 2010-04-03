var boardX = 600;
var boardY = 450;
var splitX=5;
var splitY=5;
var width = parseInt(boardX/splitX);
var height = parseInt(boardY/splitY);
var table = initTable();
$('#board').click(function(e) {
	var box = $(e.target);
	if(box.hasClass('piece')) {
		var old = box.data('pos');
		var freePos = nextToFree(old.x, old.y);
		if(freePos) {
			var newX = freePos.x;
			var newY = freePos.y;
			table[newX][newY]=table[old.x][old.y];
			table[old.x][old.y]=null;
			box.animate(pos(newX,newY)).data('pos',{x:newX,y:newY});
		}
	}
});

function nextToFree(x, y) {
	var sides = [{x:x,y:y+1},{x:x+1,y:y},{x:x,y:y-1},{x:x-1,y:y}];
	for(var i in sides) {
		var side = sides[i];
		var freePos = getIfFree(side.x, side.y);
		if(freePos) return freePos;
	}
	return null;
}
function getIfFree(x,y) { 
	return (x<0 || x>=splitX || y<0 || y>=splitY || table[x][y] != null) ? null :{x:x, y:y};
}
function initTable() {
	var board =  getBoard();
	var pieces = getPieces();
	var table = [];
	for(var x = 0; x<splitX;x++) {
		table[x]=[];
		for(var y=0;y<splitY;y++) {
			if(pieces.length) {
				var box = pieces.pop().css(pos(x,y)).data('pos',{x:x,y:y});
				board.append(box);
				table[x][y]=box;
			} else {
				table[x][y]=null;
			}
		}
	}
	return table;
}

function getPieces() {
	var pieces = [];
	for(var x = 0; x<splitX;x++) {
		for(var y = 0; y<splitY;y++) {
			pieces.push(piece(x,y));
		}
	}
	pieces.pop();
	return pieces;
}

function piece(x,y) {
	return $('<div>').addClass('piece').width(width).height(height)
	.css('background-position','-'+(x*width)+'px -'+(y*height)+'px');
}
function pos(slotX, slotY) { return {left:(slotX*width)+'px',top:(slotY*height)+'px'}}
function getBoard() {return $("#board").width(boardX).height(boardY);}