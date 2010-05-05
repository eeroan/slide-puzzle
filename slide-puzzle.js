//TODO game reset, theme, difficulty, levels, high score, timer, moves 
var lastBox;
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
    var movableBox = getMovableBox(e.keyCode);
    if (movableBox && !isOutOfBounds(movableBox, boxInfo.gridSize)) {
      moveBox(movableBox, emptyCell, table, boxInfo);
    }
    function getMovableBox(key) {
      var keyCodes = {37:'LEFT', 38:'UP', 39:'RIGHT', 40:'DOWN'};
      var directions = {
        LEFT: {x:emptyCell.x + 1, y:emptyCell.y},
        UP: {x:emptyCell.x, y:emptyCell.y + 1},
        RIGHT: {x:emptyCell.x - 1, y:emptyCell.y},
        DOWN: {x:emptyCell.x, y:emptyCell.y - 1}
      };
      return directions[keyCodes[key]];
    }
  });
}

function initClickEvent(table, boxInfo) {
  getBoard().click(function(e) {
    var box = $(e.target);
    if (box.hasClass('box')) {
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
  lastBox.css(pos({x:end.x - 1,y:end.y - 1}, boxInfo.boxSize)).hide();
  getBoard().append(lastBox);
  lastBox.fadeIn(2000, function() {
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
  var boxes = getBoxesExceptLast(boxInfo);
  var table = [];
  for (var x = 0; x < boxInfo.gridSize.x; x++) {
    table[x] = [];
    for (var y = 0; y < boxInfo.gridSize.y; y++) {
      if (boxes.length) {
        var slot = {x:x, y:y};
        var box = boxes.pop().css(pos(slot, boxInfo.boxSize)).data('pos', slot);
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
  var boxes = [];
  for (var x = 0; x < boxInfo.gridSize.x; x++) {
    for (var y = 0; y < boxInfo.gridSize.y; y++) {
      boxes.push(createBox(x, y, boxInfo));
    }
  }
  lastBox = boxes.pop();
  return boxes;
}

function createBox(x, y, boxInfo) {
  return $('<div>').addClass('box').width(boxInfo.boxSize.x).height(boxInfo.boxSize.y)
    .css('background', 'url(' + boxInfo.image + ') -' + (x * boxInfo.boxSize.x) + 'px -' + (y * boxInfo.boxSize.y) + 'px')
    .data('origPos', {x:x, y:y});
}

function pos(slot, size) {
  return {left:(slot.x * size.x) + 'px',top:(slot.y * size.y) + 'px'}
}

function getBoard(board) {
  return $('#board');
}