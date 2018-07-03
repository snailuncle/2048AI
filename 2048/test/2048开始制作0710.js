auto();
//请求截图
if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();
}


function Grid(size) {
  this.size = size;
  this.startTiles   = 2;

  this.cells = [];

  this.build();
  this.playerTurn = true;
}

Grid.prototype.build = function () {
  for (var x = 0; x < this.size; x++) {
    var row = this.cells[x] = [];
    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }
};


function Tile(position, value) {
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value;
  // this.value            = value || 2;

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

// 女娲造人 两个玩家  boy And girl
function Boy() {
}

function Girl() {
}


// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■■ ■ ■ ■ ■ ■ ■ ■ ■ ■  ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■
//      下面是方块的行为定义
// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■

//旧位置
Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};
//新位置
Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.clone = function() {
  newTile = new Tile({ x: this.x, y: this.y }, this.value);
  //newTile.previousPosition = { x: this.previousPosition.x, y: this.previousPosition.y };
  //newTile.mergedFrom = { x: this.previousPosition.x, y: this.previousPosition.y };
  return newTile;
}



// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■■ ■ ■ ■ ■ ■ ■ ■ ■ ■  ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■
//      上面是方块的行为定义
// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■




//□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□
//      下面是格子的行为定义
// □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□

//格子的序号
Grid.prototype.indexes = [];
for (var x=0; x<4; x++) {
  Grid.prototype.indexes.push([]);
  for (var y=0; y<4; y++) {
    Grid.prototype.indexes[x].push( {x:x, y:y} );
  }
}




//格子哪些地方是空的
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];
  this.eachCell(function (x, y, tile) {
  //log("Grid.prototype.availableCells tile=",tile)
    if (!tile) {
      cells.push( {x:x, y:y} );
    }
  });
  return cells;
};

//随意选择一个格子用来放方块
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();
  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

//插入方块
// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};
//移除方块
Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};
//序号正常
Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};


// 随机选择2或4放入格子
Grid.prototype.addRandomTile = function () {
  if (this.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.randomAvailableCell(), value);
    this.insertTile(tile);
  }
};

//当前有没有空格
// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

//指定格子能不能用
// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

//完整复制格子状态,空的格子是null或者undefined
Grid.prototype.clone = function() {
  newGrid = new Grid(this.size);
  // newGrid.playerTurn = this.playerTurn;
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      if (this.cells[x][y]) {
        //cell的值===Tile  Tile有clone方法
        newGrid.insertTile(this.cells[x][y].clone());
      }
    }
  }
  return newGrid;
};

//游戏开始时,格子上会有两个预先放置的方块
// Set up the initial tiles to start the game with
Grid.prototype.addStartTiles = function () {
  for (var i=0; i<this.startTiles; i++) {
    this.addRandomTile();
  }
};

//保存所有方块位置,移除merger info
// Save all tile positions and remove merger info
Grid.prototype.prepareTiles = function () {
  this.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

//移动方块到指定格子,更新方块的位置信息
// Move a tile and its representation
Grid.prototype.moveTile = function (tile, cell) {
  this.cells[tile.x][tile.y] = null;
  this.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

//格子四个方向的向量
Grid.prototype.vectors = {
  0: { x: 0,  y: -1 }, // up
  1: { x: 1,  y: 0 },  // right
  2: { x: 0,  y: 1 },  // down
  3: { x: -1, y: 0 }   // left
}

// Get the vector representing the chosen direction
Grid.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  return this.vectors[direction];
};


// 按指定方向移动格子,如果移动成功,返回true
// Move tiles on the grid in the specified direction
// returns true if move was successful
Grid.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left
  var self = this;
  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;
  var score      = 0;
  var won        = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = self.indexes[x][y];
      tile = self.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.insertTile(merged);
          self.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) {
            won = true;
          }
        } else {
          //if (debug) {
            //console.log(cell);
            //console.log(tile);
          //}
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          self.playerTurn = false;
          //console.log('setting player turn to ', self.playerTurn);
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  //console.log('returning, playerturn is', self.playerTurn);
  //if (!moved) {
    //console.log('cell', cell);
    //console.log('tile', tile);
    //console.log('direction', direction);
    //console.log(this.toString());
  //}
  return {moved: moved, score: score, won: won};
};

// Build a list of positions to traverse in the right order
Grid.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

//返回方块按指定方向可以滑动的最远位置和nextCell
Grid.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.withinBounds(cell) &&
           this.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

//两者在同一个位置
Grid.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};

//电脑添加方块
Grid.prototype.computerMove = function() {
  this.addRandomTile();
  this.playerTurn = true;
}

//还能不能滑动
//有空的格子 或者 有能合并的数字
//先检查空格子的数量
//如果没有空格子,那就必须检查紧挨着的两个数字是否相同
Grid.prototype.movesAvailable = function () {
  return this.cellsAvailable() || this.tileMatchesAvailable();
};


// Check for available matches between tiles (more expensive check)
// returns the number of matches
Grid.prototype.tileMatchesAvailable = function () {
  var self = this;

  //var matches = 0;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; //matches++; // These two tiles can be merged
          }
        }
      }
    }
  }

  //console.log(matches);
  return false; //matches;
};

//打印格子信息
Grid.prototype.toString = function() {
  string = '';
  for (var i=0; i<4; i++) {
    for (var j=0; j<4; j++) {
      if (this.cells[j][i]) {
        string += this.cells[j][i].value + ' ';
      } else {
        string += '_ ';
      }
    }
    string += '\n';
  }
  return string;
}



// counts the number of isolated groups.
Grid.prototype.islands = function() {
  var self = this;
  var mark = function(x, y, value) {
    if (x >= 0 && x <= 3 && y >= 0 && y <= 3 &&
        self.cells[x][y] &&
        self.cells[x][y].value == value &&
        !self.cells[x][y].marked ) {
      self.cells[x][y].marked = true;

      for (direction in [0,1,2,3]) {
        var vector = self.getVector(direction);
        mark(x + vector.x, y + vector.y, value);
      }
    }
  }

  var islands = 0;

  for (var x=0; x<4; x++) {
    for (var y=0; y<4; y++) {
      if (this.cells[x][y]) {
        this.cells[x][y].marked = false
      }
    }
  }
  for (var x=0; x<4; x++) {
    for (var y=0; y<4; y++) {
      if (this.cells[x][y] &&
          !this.cells[x][y].marked) {
        islands++;
        mark(x, y , this.cells[x][y].value);
      }
    }
  }

  return islands;
}


//平滑度   2-2-2-2-2-2-2
// measures how smooth the grid is (as if the values of the pieces
// were interpreted as elevations). Sums of the pairwise difference
// between neighboring tiles (in log space, so it represents the
// number of merges that need to happen before they can merge).
// Note that the pieces can be distant
Grid.prototype.smoothness = function() {
  var smoothness = 0;
  for (var x=0; x<4; x++) {
    for (var y=0; y<4; y++) {
      if ( this.cellOccupied( this.indexes[x][y] )) {
        var value = Math.log(this.cellContent( this.indexes[x][y] ).value) / Math.log(2);
        for (var direction=1; direction<=2; direction++) {
          var vector = this.getVector(direction);
          var targetCell = this.findFarthestPosition(this.indexes[x][y], vector).next;

          if (this.cellOccupied(targetCell)) {
            var target = this.cellContent(targetCell);
            var targetValue = Math.log(target.value) / Math.log(2);
            smoothness -= Math.abs(value - targetValue);
          }
        }
      }
    }
  }
  return smoothness;
}

// 单调性1
Grid.prototype.monotonicity = function() {
  var self = this;
  var marked = [];
  var queued = [];
  var highestValue = 0;
  var highestCell = {x:0, y:0};
  for (var x=0; x<4; x++) {
    marked.push([]);
    queued.push([]);
    for (var y=0; y<4; y++) {
      marked[x].push(false);
      queued[x].push(false);
      if (this.cells[x][y] &&
          this.cells[x][y].value > highestValue) {
        highestValue = this.cells[x][y].value;
        highestCell.x = x;
        highestCell.y = y;
      }
    }
  }

  increases = 0;
  cellQueue = [highestCell];
  queued[highestCell.x][highestCell.y] = true;
  markList = [highestCell];
  markAfter = 1; // only mark after all queued moves are done, as if searching in parallel

  var markAndScore = function(cell) {
    markList.push(cell);
    var value;
    if (self.cellOccupied(cell)) {
      value = Math.log(self.cellContent(cell).value) / Math.log(2);
    } else {
      value = 0;
    }
    for (direction in [0,1,2,3]) {
      var vector = self.getVector(direction);
      var target = { x: cell.x + vector.x, y: cell.y+vector.y }
      if (self.withinBounds(target) && !marked[target.x][target.y]) {
        if ( self.cellOccupied(target) ) {
          targetValue = Math.log(self.cellContent(target).value ) / Math.log(2);
          if ( targetValue > value ) {
            //console.log(cell, value, target, targetValue);
            increases += targetValue - value;
          }
        }
        if (!queued[target.x][target.y]) {
          cellQueue.push(target);
          queued[target.x][target.y] = true;
        }
      }
    }
    if (markAfter == 0) {
      while (markList.length > 0) {
        var cel = markList.pop();
        marked[cel.x][cel.y] = true;
      }
      markAfter = cellQueue.length;
    }
  }

  while (cellQueue.length > 0) {
    markAfter--;
    markAndScore(cellQueue.shift())
  }

  return -increases;
}

//单调性2

// measures how monotonic the grid is. This means the values of the tiles are strictly increasing
// or decreasing in both the left/right and up/down directions
Grid.prototype.monotonicity2 = function() {
  // scores for all four directions
  var totals = [0, 0, 0, 0];

  // up/down direction
  for (var x=0; x<4; x++) {
    var current = 0;
    var next = current+1;
    while ( next<4 ) {
      while ( next<4 && !this.cellOccupied( this.indexes[x][next] )) {
        next++;
      }
      if (next>=4) { next--; }
      var currentValue = this.cellOccupied({x:x, y:current}) ?
        Math.log(this.cellContent( this.indexes[x][current] ).value) / Math.log(2) :
        0;
      var nextValue = this.cellOccupied({x:x, y:next}) ?
        Math.log(this.cellContent( this.indexes[x][next] ).value) / Math.log(2) :
        0;
      if (currentValue > nextValue) {
        totals[0] += nextValue - currentValue;
      } else if (nextValue > currentValue) {
        totals[1] += currentValue - nextValue;
      }
      current = next;
      next++;
    }
  }

  // left/right direction
  for (var y=0; y<4; y++) {
    var current = 0;
    var next = current+1;
    while ( next<4 ) {
      while ( next<4 && !this.cellOccupied( this.indexes[next][y] )) {
        next++;
      }
      if (next>=4) { next--; }
      var currentValue = this.cellOccupied({x:current, y:y}) ?
        Math.log(this.cellContent( this.indexes[current][y] ).value) / Math.log(2) :
        0;
      var nextValue = this.cellOccupied({x:next, y:y}) ?
        Math.log(this.cellContent( this.indexes[next][y] ).value) / Math.log(2) :
        0;
      if (currentValue > nextValue) {
        totals[2] += nextValue - currentValue;
      } else if (nextValue > currentValue) {
        totals[3] += currentValue - nextValue;
      }
      current = next;
      next++;
    }
  }

  return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
}

//格子中最大的数字
Grid.prototype.maxValue = function() {
  var max = 0;
  for (var x=0; x<4; x++) {
    for (var y=0; y<4; y++) {
      if (this.cellOccupied(this.indexes[x][y])) {
        var value = this.cellContent(this.indexes[x][y]).value;
        if (value > max) {
          max = value;
        }
      }
    }
  }

  return Math.log(max) / Math.log(2);
}


//赢了没
Grid.prototype.isWin = function() {
  var self = this;
  for (var x=0; x<4; x++) {
    for (var y=0; y<4; y++) {
      if (self.cellOccupied(this.indexes[x][y])) {
        if (self.cellContent(this.indexes[x][y]).value == 2048) {
          return true;
        }
      }
    }
  }
  return false;
}

// □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□
//      上面是格子的行为定义
// □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□







// ♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂
//      下面是男孩的行为定义
// ♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂
//其实女孩子很孤独,因为男孩是个AI
function AI(grid) {
  this.grid = grid;
}

// static evaluation function
//静态评价函数
AI.prototype.eval = function() {
  //有多少空格子
  var emptyCells = this.grid.availableCells().length;

 //log("\n",this.grid.toString())
 //log("AI.prototype.eval中的变量emptyCells=",emptyCells)

  var smoothWeight = 0.1,
      //monoWeight   = 0.0,
      //islandWeight = 0.0,
      mono2Weight  = 1.0,
      emptyWeight  = 2.7,
      maxWeight    = 1.0;

  return this.grid.smoothness() * smoothWeight
       //+ this.grid.monotonicity() * monoWeight
       //- this.grid.islands() * islandWeight
       + this.grid.monotonicity2() * mono2Weight
       + Math.log(emptyCells) * emptyWeight
       + this.grid.maxValue() * maxWeight;
};


// alpha-beta depth first search
// 极小极大搜索 （alpha-beta剪枝）
// var newBest = this.search(depth, -10000, 10000, 0 ,0);
AI.prototype.search = function(depth, alpha, beta, positions, cutoffs) {
 //log("703行AI.prototype.search的参数是",depth, alpha, beta, positions, cutoffs)
  var bestScore;
  var bestMove = -1;
  var result;

  // the maxing player
  if (this.grid.playerTurn) {
   //log("this.grid.playerTurn是玩家在玩")
    bestScore = alpha;
    for (var direction in [0, 1, 2, 3]) {
     //log("循环的方向direction=",direction)
      var newGrid = this.grid.clone();
     //log("newGrid=",newGrid)
      // newGrid= {
      //   size: 4,
      //   startTiles: 2,
      //   cells:
      //    [ [ [Object], [Object], [Object], [Object] ],
      //      [ [Object], [Object], [Object], [Object] ],
      //      [ [Object], [Object], [Object], [Object] ],
      //      [ [Object], [Object], [Object], [Object] ] ],
      //   playerTurn: true
      // }
      if (newGrid.move(direction).moved) {
       //log("方向direction=",direction,"可以滑动")
        positions++;
        if (newGrid.isWin()) {
         //log("2048胜利,开不开心,惊不惊喜,意不意外!")
          return { move: direction, score: 10000, positions: positions, cutoffs: cutoffs };
        }
        var newAI = new AI(newGrid);
       //log("newAI=",newAI)
        if (depth == 0) {
         //log("if (depth == 0)")
          result = { move: direction, score: newAI.eval() };
         //log("if (depth == 0) { result=",result)
        } else {
         //log("if (depth == 0)的else")
          result = newAI.search(depth-1, bestScore, beta, positions, cutoffs);
          if (result.score > 9900) { // win
            result.score--; // to slightly penalize higher depth from win
          }
          positions = result.positions;
          cutoffs = result.cutoffs;
        }

        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = direction;
        }
        if (bestScore > beta) {
          cutoffs++
          return { move: bestMove, score: beta, positions: positions, cutoffs: cutoffs };
        }
      }
    }
  }

  else { // computer's turn, we'll do heavy pruning to keep the branching factor low
   //log("this.grid.playerTurn是电脑在玩")

    bestScore = beta;

    // try a 2 and 4 in each cell and measure how annoying it is
    // with metrics from eval
    var candidates = [];
    var cells = this.grid.availableCells();
    var scores = { 2: [], 4: [] };
    for (var value in scores) {
      for (var i in cells) {
        scores[value].push(null);
        var cell = cells[i];
        var tile = new Tile(cell, parseInt(value, 10));
        this.grid.insertTile(tile);
        scores[value][i] = -this.grid.smoothness() + this.grid.islands();
        this.grid.removeTile(cell);
      }
    }

    // now just pick out the most annoying moves
    var maxScore = Math.max(Math.max.apply(null, scores[2]), Math.max.apply(null, scores[4]));
    for (var value in scores) { // 2 and 4
      for (var i=0; i<scores[value].length; i++) {
        if (scores[value][i] == maxScore) {
          candidates.push( { position: cells[i], value: parseInt(value, 10) } );
        }
      }
    }

    // search on each candidate
    for (var i=0; i<candidates.length; i++) {
      var position = candidates[i].position;
      var value = candidates[i].value;
      var newGrid = this.grid.clone();
      var tile = new Tile(position, value);
      newGrid.insertTile(tile);
      newGrid.playerTurn = true;
      positions++;
      newAI = new AI(newGrid);
      result = newAI.search(depth, alpha, bestScore, positions, cutoffs);
      positions = result.positions;
      cutoffs = result.cutoffs;

      if (result.score < bestScore) {
        bestScore = result.score;
      }
      if (bestScore < alpha) {
        cutoffs++;
        return { move: null, score: alpha, positions: positions, cutoffs: cutoffs };
      }
    }
  }

  return { move: bestMove, score: bestScore, positions: positions, cutoffs: cutoffs };
}


// performs a search and returns the best move
//返回价值最大的移动方向
AI.prototype.getBest = function() {
  return this.iterativeDeep();
}

// performs iterative deepening over the alpha-beta search
// 在αβ搜索上执行迭代深度搜索
AI.prototype.iterativeDeep = function() {
  var start = (new Date()).getTime();
  var depth = 0;
  var best="最好的方向是没有方向,来自AI.prototype.iterativeDeep的问候";
  do {
    var newBest = this.search(depth, -10000, 10000, 0 ,0);
    if (newBest.move == -1) {
     //log("newBest=-1,search失败")
      break;
    } else {
      best = newBest;
    }
    depth++;
  } while ( (new Date()).getTime() - start < minSearchTime);
  return best
}

AI.prototype.translate = function(move) {
 return {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  }[move];
}





























// ♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂
//      上面是男孩的行为定义
// ♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂♂




// ♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀
//      下面是女孩的行为定义
// ♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀
// 其实女孩子不孤单,因为压根儿没女孩


// ♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀
//      上面是女孩的行为定义
// ♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀♀

firstGridLeftTopCorner={x:77,y:647}
//挨着第一个格子

rightGrid={x:330,y:647}

downGrid={x:77,y:921}

leftRightDistance=rightGrid.x-firstGridLeftTopCorner.x
upDownDistance=downGrid.y-firstGridLeftTopCorner.y

lightScreen();
grids = new Array(16);


NumberColors={
  8:"#BEC9FF",
  16:"#7DD7FF",
  32:"#A6FFE3",
  64:"#A9FF9D",
  128:"#FFE682",
  256:"#FFA942",
  512:"#D583FF",
  1024:"#FEFC38"
}
minSearchTime=30




while(1){

// 步骤1
//识别并使用Grid的插入方法,插入当前格子的数据


//初始化十六个格子数字都是0
let k=0
let j=0
for(var i=0;i<grids.length;i++){
  if(i==4 || i==8 || i==12){
    k=0
  }
  if(i==4 || i==8 || i==12){
    j++
  }
  let x=firstGridLeftTopCorner.x+k*leftRightDistance
  let y=firstGridLeftTopCorner.y+j*upDownDistance
  grids[i] = {num:0,x:x,y:y};
  k++;
}
//---------------------无限循环开始-----------------------------
  // while(1){
  // sleep(100)
  grids=recogniseGrid()
  // gridsLog()
  newGrid = new Grid(4);
  for(var item of grids){
    if(item){
      let tile=new Tile({x:item.x,y:item.y},item.num)
      newGrid.insertTile(tile)
    }
    // else{
    //   newGrid.insertTile(null)
    // }
  }
  // log("\n插入识别后的格子=\n",newGrid.toString())
  // exit()
  ai = new AI(newGrid);
  // logStars()
  aiGetBest=ai.getBest();
  bestDirection=ai.translate(aiGetBest.move)
  //log("AI计算出的最佳滑动方向=",bestDirection)
  switch(bestDirection)
  {
    case 'up':
      上滑()
      break;
    case 'down':
      下滑()
      break;
    case 'left':
      左滑()
      break;
    case 'right':
      右滑()
      break;
    default:
    //log('不存在这个滑动方向maxNum,',scoreResult.direction)
  }

}




function logStars(num){
  let n=num || 300
  let s=""
  for(i=0;i<n;i++){
    s=s+"*"
  }
 //log(s)
}
















//-------------------------识别数字函数------------------------------------

function recogniseGrid(){
  img=captureScreen()
  for(var i=0;i<16;i++){
    let color=images.pixel(img, grids[i].x, grids[i].y)
    color=colors.toString(color)
    try{
      Object.keys(NumberColors).forEach(function(key){
        if(colors.isSimilar(color,NumberColors[key])){
          grids[i].num=parseInt(key)
          throw err = new Error("\n第"+i+"个格子是"+key);
        }
      });
    }catch( e ) {
    }
  }
  return oordinateTransformationIntoSequenceNumber(grids)
}


function oordinateTransformationIntoSequenceNumber(grids){
  let newGrids=[]
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      let x=j
      let y=i
      let num=grids[i*4+j].num
      let item={x:x,y:y,num:num}
      if(num===0){
        item=null
      }
      newGrids.push(item)
    }
  }
  return newGrids
}
function gridsLog(){
  let gridNums="\n"
  for(var i=0;i<16;i++){
    if(i==4 || i==8 || i==12){
      gridNums=gridNums+"\n"
    }
    if(grids[i]){
      gridNums=gridNums+grids[i]["num"]+","
    }else{
      gridNums=gridNums+"_"+","
    }
  }
//log(gridNums)
}


//-------------------------点亮屏幕------------------------------------

function lightScreen(){
  let isScreenOn=device.isScreenOn()
  if(isScreenOn){
  }else{
    device.wakeUpIfNeeded()
    sleep(1000)
    //解锁屏幕
    unlockingScreen()
    sleep(1000)
  }
}

function unlockingScreen(){
  //log("开始上滑")
  swipe(520,1361, 547,335, 300)
  sleep(100)
  //log("九宫格解锁")
  gesture(300, [253,1058], [541,1054], [536,1342],[537,1627])
}


//-----------------滑动动作------------------------------------------

function 上滑(){
  let duration=10
  let xy=[461,1084,487,512]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}
function 下滑(){
  let duration=10
  let xy=[487,512,461,1084]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}
function 左滑(){
  let duration=10
  let xy=[972,527,109,525]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}
function 右滑(){
  let duration=10
  let xy=[309,525,972,527]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}
