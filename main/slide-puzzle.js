//TODO theme, difficulty, levels, high score, timer, moves, mouse over

$.fn.slidePuzzle = function(opts) {
  var emptyCell
  var container = this
  init(opts)

  function init(opts) {
    if(opts.width && opts.height) {
      initWithImageDimensions(opts, {x:opts.width, y:opts.height})
    } else {
      container.append('<img>', {src:opts.image,class:imgHolder})
      $('.imgHolder', container).load(function() {
        var image = $('.imgHolder', container).get(0)
        var board = {x:image.width, y:image.height}
        initWithImageDimensions(opts, board)
      })
    }
  }

  function initWithImageDimensions(opts, board) {
    var boxInfo = {}
    boxInfo.gridSize = {x:opts.split, y:opts.split}
    boxInfo.boxSize = {x:divideFor('x'), y:divideFor('y')}
    boxInfo.image = opts.image
    var table = createTable(board, boxInfo)
    initEvents(table, boxInfo)
    function divideFor(axis) {
      return parseInt(board[axis] / boxInfo.gridSize[axis])
    }
  }

  function neighboursOf(point) {
    return {
      LEFT: {x:point.x + 1, y:point.y},
      UP: {x:point.x, y:point.y + 1},
      RIGHT: {x:point.x - 1, y:point.y},
      DOWN: {x:point.x, y:point.y - 1}
    }
  }

  function initEvents(table, boxInfo) {
    var click = getBoard().toObservable('click').Select(eventTarget).Where(isBox).Select(boxPosition)
    var keyPress = $(document).toObservable('keyup').Select(getMovableBox)

    click.Subscribe(function(from) {
      if(findNextToFree(from, boxInfo.gridSize, table.grid)) {
        moveBox(from, emptyCell, table, boxInfo)
      }
    })

    keyPress.Subscribe(function(from) {
      if(from && isInBounds(from, boxInfo.gridSize)) {
        moveBox(from, emptyCell, table, boxInfo)
      }
    })
    function getMovableBox(e) {
      var key = e.keyCode
      var keyCodes = {37:'LEFT', 38:'UP', 39:'RIGHT', 40:'DOWN'}
      return neighboursOf(emptyCell)[keyCodes[key]]
    }

    function isBox(box) {
      return box.hasClass('box')
    }

    function boxPosition(box) {
      return box.data('pos')
    }

    function eventTarget(e) {
      return $(e.target)
    }
  }

  function moveBox(from, to, tableObj, boxInfo) {
    var table = tableObj.grid
    var box = table[from.x][from.y]
    table[to.x][to.y] = box
    table[from.x][from.y] = null
    emptyCell = from
    box.animate(pos(to, boxInfo.boxSize), 300, validate).data('pos', to)
    function validate() {
      if(isDone(table)) gameCompleted(boxInfo, tableObj.hiddenBox)
    }
  }

  function gameCompleted(boxInfo, hiddenBox) {
    var end = boxInfo.gridSize
    hiddenBox.css(pos({x:end.x - 1,y:end.y - 1}, boxInfo.boxSize)).hide().appendTo(getBoard()).fadeIn(2000, function() {
      alert("Congratulations! Play again?")
      document.location = document.location.href
    })
  }

  function isDone(table) {
    for(var x in table) {
      for(var y in table[x]) {
        var slot = table[x][y]
        if(slot) {
          var box = slot.data('origPos')
          if(box.x != x || box.y != y) {
            return false
          }
        }
      }
    }
    return true
  }

  function findNextToFree(old, grid, table) {
    var sides = neighboursOf(old)
    for(var i in sides) {
      var side = sides[i]
      if(isInBounds(side, grid) && table[side.x][side.y] == null) return side
    }
    return null
  }

  function isInBounds(box, grid) {
    return box.x >= 0 && box.x < grid.x && box.y >= 0 && box.y < grid.y
  }

  function createTable(boardDim, boxInfo) {
    var board = getBoard().width(boardDim.x).height(boardDim.y)
    var boxes = getBoxes(boxInfo)
    var hiddenBox = boxes.pop()
    var table = []
    for(var x = 0; x < boxInfo.gridSize.x; x++) {
      table[x] = []
      for(var y = 0; y < boxInfo.gridSize.y; y++) {
        if(boxes.length) {
          var slot = {x:x, y:y}
          var box = boxes.pop().css(pos(slot, boxInfo.boxSize)).data('pos', slot)
          board.append(box)
          table[x][y] = box
        } else {
          table[x][y] = null
          emptyCell = {x:x,y:y}
        }
      }
    }
    return {grid:table, hiddenBox: hiddenBox}
  }

  function getBoxes(boxInfo) {
    var boxes = []
    for(var x = 0; x < boxInfo.gridSize.x; x++) {
      for(var y = 0; y < boxInfo.gridSize.y; y++) {
        boxes.push(createBox(x, y, boxInfo))
      }
    }
    return boxes
  }

  function createBox(x, y, boxInfo) {
    with(boxInfo) {
      return $('<div>').addClass('box').width(boxSize.x).height(boxSize.y)
        .css('background', 'url(' + image + ') -' + (x * boxSize.x) + 'px -' + (y * boxSize.y) + 'px')
        .data('origPos', {x:x, y:y})
    }
  }

  function pos(slot, size) {
    return {left:(slot.x * size.x) + 'px',top:(slot.y * size.y) + 'px'}
  }

  function getBoard() {
    return container
  }
}
