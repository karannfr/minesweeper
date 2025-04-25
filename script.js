const tiles = document.querySelector('.tiles');
let htmlString = "";
for(let i=0;i<16;i++){
  for(let j=0;j<16;j++){
    htmlString = htmlString + `<button class="tile" id="btn-${i}-${j}"></button>`
  }
}
function generateMinesweeperBoard(rows = 16, cols = 16, mineCount = 40){
  const board = Array.from({ length: rows }, () => Array(cols).fill(0));
  let placedMines = 0;
  while (placedMines < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c] === -1) continue;
    board[r][c] = -1;
    placedMines++;
    for (let i = r - 1; i <= r + 1; i++) {
      for (let j = c - 1; j <= c + 1; j++) {
        if (
          i >= 0 &&
          i < rows &&
          j >= 0 &&
          j < cols &&
          board[i][j] !== -1
        ) {
          board[i][j]++;
        }
      }
    }
  }
  return board;
}
const board = generateMinesweeperBoard();
tiles.innerHTML = htmlString;
const play = document.querySelectorAll('.tile');
for(let i=0;i<play.length;i++){
  play[i].addEventListener("click",() => placeflag(play[i].id));
  play[i].addEventListener("dblclick",() => playmove(play[i].id));
}
function placeflag(pos){
  document.querySelector(`#${pos}`).style.backgroundImage = "url(/assets/Flag.svg)";
}

function playmove(pos){
  let i = Number(pos.charAt(5));
  let j = Number(pos.charAt(7));
  if(board[i][j] == -1){
    document.querySelector(`#${pos}`).style.backgroundImage = "url(/assets/Mine.svg)";
  }
  else{
    revealTiles(i,j);
  }
}

const visited = new Set();

function revealTiles(i, j) {
  const key = `${i}-${j}`;
  if (visited.has(key)) return;
  visited.add(key);

  const tile = document.querySelector(`#btn-${i}-${j}`);
  tile.style.backgroundImage = `url(/assets/${board[i][j]}.svg)`;
  if (board[i][j] !== 0) return;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue;
      const ni = i + x;
      const nj = j + y;
      if (ni >= 0 && ni < 16 && nj >= 0 && nj < 16) {
        revealTiles(ni, nj);
      }
    }
  }
}


