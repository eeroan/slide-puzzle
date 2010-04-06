//TODO game reset, theme, difficulty, levels, high score, timer, moves 
var lastPiece;
var emptyCell;

init({image:'Koala.jpg', split:3});

function afterImageIsLoaded(image, callBack) {
  setTimeout(function() {
    if (image.width) callBack({x:image.width, y:image.height});
    else afterImageIsLoaded(image, callBack);
  }, 13);
}

function init(opts) {
  var image = new Image();
  image.src = opts.image;
  afterImageIsLoaded(image, function(board) {
    var boxInfo = {};
    boxInfo.gridSize = {x:opts.split, y:opts.split};
    boxInfo.boxSize = {x:divideFor('x'), y:divideFor('y')};
    boxInfo.image = opts.image;
    var table = createTable(board, boxInfo);
    initClickEvent(table, boxInfo);
    initKeyEvent(table, boxInfo);
    function divideFor(axis) {
      return parseInt(board[axis] / boxInfo.gridSize[axis])
    }
  });
}

function initKeyEvent(table, boxInfo) {
  $(document).keyup(function(e) {
    var keyCodes = {LEFT:37, UP:38, RIGHT:39, DOWN:40};
    var movableBox;
    switch (e.keyCode) {
      case keyCodes.LEFT: movableBox = {x:emptyCell.x + 1, y:emptyCell.y}; break;
      case keyCodes.UP: movableBox = {x:emptyCell.x, y:emptyCell.y + 1}; break;
      case keyCodes.RIGHT: movableBox = {x:emptyCell.x - 1, y:emptyCell.y}; break;
      case keyCodes.DOWN: movableBox = {x:emptyCell.x, y:emptyCell.y - 1}; break;
      default: return;
    }
    if (!isOutOfBounds(movableBox, boxInfo.gridSize)) {
      moveBox(movableBox, emptyCell, table, boxInfo);
    }
  });
}

function initClickEvent(table, boxInfo) {
  getBoard().click(function(e) {
    var box = $(e.target);
    if (box.hasClass('piece')) {
      var from = box.data('pos');
      var to = findNextToFree(from, boxInfo.gridSize, table);
      if (to) moveBox(from, to, table, boxInfo)
    }
  });
}

function moveBox(from, to, table, boxInfo) {
  var box = table[from.x][from.y];
  table[to.x][to.y] = box;
  table[from.x][from.y] = null;
  emptyCell = from;
  box.animate(pos(to, boxInfo.boxSize), 300, validate).data('pos', to);
  function validate() {
    if (isDone(table)) gameCompleted(boxInfo);
  }
}

function gameCompleted(boxInfo) {
  var end = boxInfo.gridSize;
  lastPiece.css(pos({x:end.x - 1,y:end.y - 1}, boxInfo.boxSize)).hide();
  getBoard().append(lastPiece);
  lastPiece.fadeIn(2000, function() {
    alert("Congratulations! Play again?");
    document.location = document.location.href;
  });
}

function isDone(table) {
  for (var x in table) {
    for (var y in table[x]) {
      var slot = table[x][y];
      if (slot) {
        var box = slot.data('origPos');
        if (box.x != x || box.y != y) {
          return false;
        }
      }
    }
  }
  return true;
}

function findNextToFree(old, grid, table) {
  var x = old.x;
  var y = old.y;
  var sides = [
    {x:x, y:y + 1},
    {x:x + 1, y:y},
    {x:x, y:y - 1},
    {x:x - 1, y:y}
  ];

  for (var i in sides) {
    var side = sides[i];
    if(!isOutOfBounds(side, grid) && table[side.x][side.y] == null) return side;
  }
  return null;
}

function isOutOfBounds(box, grid) {
  return box.x < 0 || box.x >= grid.x || box.y < 0 || box.y >= grid.y;
}

function createTable(boardDim, boxInfo) {
  var board = getBoard(boardDim).width(boardDim.x).height(boardDim.y);
  var pieces = getBoxesExceptLast(boxInfo);
  var table = [];
  for (var x = 0; x < boxInfo.gridSize.x; x++) {
    table[x] = [];
    for (var y = 0; y < boxInfo.gridSize.y; y++) {
      if (pieces.length) {
        var slot = {x:x, y:y};
        var box = pieces.pop().css(pos(slot, boxInfo.boxSize)).data('pos', slot);
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

function getBoxesExceptLast(boxInfo) {
  var pieces = [];
  for (var x = 0; x < boxInfo.gridSize.x; x++) {
    for (var y = 0; y < boxInfo.gridSize.y; y++) {
      pieces.push(piece(x, y, boxInfo));
    }
  }
  lastPiece = pieces.pop();
  return pieces;
}

function piece(x, y, boxInfo) {
  return $('<div>').addClass('piece').width(boxInfo.boxSize.x).height(boxInfo.boxSize.y)
    .css('background', 'url(' + boxInfo.image + ') -' + (x * boxInfo.boxSize.x) + 'px -' + (y * boxInfo.boxSize.y) + 'px')
    .data('origPos', {x:x, y:y});
}

function pos(slot, size) {
  return {left:(slot.x * size.x) + 'px',top:(slot.y * size.y) + 'px'}
}

function getBoard(board) {
  return $('#board');
}