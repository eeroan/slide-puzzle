var boardX = 600;
var boardY = 450;
var splitX=5;
var splitY=5;
var width = parseInt(boardX/splitX);
var height = parseInt(boardY/splitY);
var board =  getBoard();
var pieces = getPieces();

for(var x = 0; x<splitX;x++) {
	for(var y=0;y<splitY;y++) {
		board.append(pieces.pop().css(pos(x,y)));
	}
}
function pos(slotX, slotY) { return {left:(slotX*width)+'px',top:(slotY*height)+'px'}}
function getBoard() {return $("#board").css('width',boardX+'px').css('height',boardY+'px');}
function piece(x,y) {
	return $('<div>')
	.addClass('piece')
	.css('background-position','-'+(x*width)+'px -'+(y*height)+'px')
	.width(width)
	.height(height);
}

function getPieces() {
	var pieces = [];
	for(var x = 0; x<splitX;x++) {
		for(var y = 0; y<splitY;y++) {
			pieces.push(piece(x,y));
		}
	}
	return pieces;
}
