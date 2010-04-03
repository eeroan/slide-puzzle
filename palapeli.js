init();

function init() {
	var boardX = 600;
	var boardY = 450;
	var splitX=5;
	var splitY=5;
	var width = parseInt(boardX/splitX);
	var height = parseInt(boardY/splitY);
	var table = initTable(boardX, boardY, splitX, splitY, width, height);
	initClickEvent(table, width, height, splitX, splitY);
}

function initClickEvent(table, width, height, splitX, splitY) {
	$('#board').click(function(e) {
		var box = $(e.target);
		if(box.hasClass('piece')) {
			var old = box.data('pos');
			var freePos = nextToFree(old.x, old.y, splitX, splitY, table);
			if(freePos) {
				var newX = freePos.x;
				var newY = freePos.y;
				table[newX][newY]=table[old.x][old.y];
				table[old.x][old.y]=null;
				box.animate(pos(newX,newY, width, height)).data('pos',{x:newX,y:newY});
			}
		}
	});
}
function nextToFree(x, y, splitX, splitY, table) {
	var sides = [{x:x,y:y+1},{x:x+1,y:y},{x:x,y:y-1},{x:x-1,y:y}];
	for(var i in sides) {
		var side = sides[i];
		var freePos = getIfFree(side.x, side.y, splitX, splitY, table);
		if(freePos) return freePos;
	}
	return null;
}
function getIfFree(x, y, splitX, splitY, table) { 
	return (x<0 || x>=splitX || y<0 || y>=splitY || table[x][y] != null) ? null :{x:x, y:y};
}

function initTable(boardX, boardY, splitX,splitY, width,height) {
	var board =  getBoard(boardX, boardY);
	var pieces = getPieces(splitX, splitY, width, height);
	var table = [];
	for(var x = 0; x<splitX;x++) {
		table[x]=[];
		for(var y=0;y<splitY;y++) {
			if(pieces.length) {
				var box = pieces.pop().css(pos(x,y,width,height)).data('pos',{x:x,y:y});
				board.append(box);
				table[x][y]=box;
			} else {
				table[x][y]=null;
			}
		}
	}
	return table;
}

function getPieces(splitX, splitY, width, height) {
	var pieces = [];
	for(var x = 0; x<splitX;x++) {
		for(var y = 0; y<splitY;y++) {
			pieces.push(piece(x,y, width, height));
		}
	}
	pieces.pop();
	return pieces;
}

function piece(x,y, width, height) {
	return $('<div>').addClass('piece').width(width).height(height)
	.css('background-position','-'+(x*width)+'px -'+(y*height)+'px');
}
function pos(slotX, slotY, width, height) { return {left:(slotX*width)+'px',top:(slotY*height)+'px'}}
function getBoard(boardX, boardY) {return $("#board").width(boardX).height(boardY);}