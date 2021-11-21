/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie) game
 */

let WIDTH = 7;
let HEIGHT = 6;
let currPlayer = 'Red'; // active player: 1 or 2
let board = [];
const startBtn = document.querySelector('button');
const redTurn = document.querySelector('#red-turn');
const blueTurn = document.querySelector('#blue-turn');

// var board = []; // array of rows, each row is array of cells  (board[y][x])

function makeBoard() {
  const gameBoard = [];
  for(let i = HEIGHT; i > 0; i--){
    let row = [];
    for(let i = WIDTH; i > 0; i--){
      row.push(null);
    }
    // board.push(arr);
    gameBoard.push(row);
  }
  return gameBoard;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');
  
  // create dom element for piece placing row
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //fill 'top' with correct number of cells
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create dom elements for game board 
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for(let i = HEIGHT-1; i >= 0; i--){
    if(board[i][x] === null){
      return i;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const newPiece = document.createElement('div');
  newPiece.classList.toggle(currPlayer);
  document.getElementById(`${y}-${x}`).appendChild(newPiece);

}


/** endGame: announce game end */

function endGame(msg) {
  document.querySelector('#column-top').removeEventListener('click',handleClick);
  if(currPlayer === 'Red'){
    blueTurn.className = 'red-turn';
  }
  else redTurn.className = 'blue-turn';
  blueTurn.innerText = msg;
  redTurn.innerText = msg;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`${currPlayer} Wins!`);
  }

  // check for tie
  if(checkForTie()){
    return endGame(`Tie`);
  }

  // switch players
  if(currPlayer === 'Red'){
    currPlayer = 'Blue';
    redTurn.classList.toggle('hidden');
    blueTurn.classList.toggle('hidden');
    return;
  }
  currPlayer = 'Red';
  redTurn.classList.toggle('hidden');
  blueTurn.classList.toggle('hidden');
  return;
}

function checkForTie(){
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      if(board[i][j] === null){
        return false;
      }
    }
  }
  return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}


startBtn.addEventListener('click', () => {
  if(board[5]){
    board = [];
    document.querySelector('#board').innerText = '';
    blueTurn.innerText = 'BLUE TURN';
    blueTurn.classList = 'hidden blue-turn'
    redTurn.innerText = 'RED TURN';
    redTurn.classList = 'red-turn'
    currPlayer = 'Red';
  }
  document.querySelector('button').innerText = 'RESTART GAME';
  document.querySelector('#board').classList.remove('hidden');
  redTurn.classList.remove('hidden');
  board= makeBoard();
  makeHtmlBoard();
  
})


