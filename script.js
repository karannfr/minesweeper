const tiles = document.querySelector('.tiles');
let htmlString = "";
const visited = new Set();
let time = 0;
let gameover = false;
let started = false;
let highscore = JSON.parse(localStorage.getItem("highscore")) || [];
const names = document.querySelectorAll('.table-name p');
const times = document.querySelectorAll('.table-time p');
for(let i=0;i<highscore.length;i++){
  names[i].innerHTML = `<p>${highscore[i].name}</p>`;
  times[i].innerHTML = `<p>${highscore[i].minutes}:${highscore[i].seconds}</p>`;
}
for(let i = 0; i < 16; i++) {
  for(let j = 0; j < 16; j++) {
    if (i < 10 && j < 10)
      htmlString += `<button class="tile" id="btn-0${i}-0${j}"></button>`;
    else if (i < 10 && j >= 10)
      htmlString += `<button class="tile" id="btn-0${i}-${j}"></button>`;
    else if (i >= 10 && j < 10)
      htmlString += `<button class="tile" id="btn-${i}-0${j}"></button>`;
    else
      htmlString += `<button class="tile" id="btn-${i}-${j}"></button>`;
  }
}
let stop;

function generateMinesweeperBoard(rows = 16, cols = 16, mineCount = 40) {
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
        if (i >= 0 && i < rows && j >= 0 && j < cols && board[i][j] !== -1) {
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

const gameWon = () => {
  let i = 0;
  for(i=0;i<highscore.length;i++){
    compareTime = Number(highscore[i].minutes)*60 + Number(highscore[i].seconds);
    if(compareTime>time)
      break;
  }
  if(i==5){
    const overlay = document.querySelector('.overlay');
    overlay.style.display = "block";
    const modal = document.querySelector('.modal');
    modal.style.display = "flex";
    modal.querySelector('p').innerHTML = `Congratualtions, you won!!`;
    setTimeout(() => {
      const overlay = document.querySelector('.overlay');
      overlay.style.display = "none";
      const modal = document.querySelector('.modal');
      modal.style.display = "none";
    },3000);
  }
  else{
    let minutes = String(parseInt((time/60)));
    let seconds = String(parseInt((time%60)));
    if(minutes<10 && seconds<10){
      minutes = '0' + minutes;
      seconds = '0' + seconds;
    }
    else if(minutes<10 && seconds>=10){
      minutes = '0' + minutes;
    }
    else if(minutes<10 && seconds>=10){
      seconds = '0' + seconds
    }
    const overlay = document.querySelector('.overlay');
    overlay.style.display = "block";
    const modal = document.querySelector('.modal');
    modal.style.display = "flex";
    modal.querySelector('p').innerHTML = `Congratualtions, you have made a new highscore!! <br> ${minutes}:${seconds}`;
    document.addEventListener('keydown', (event) =>{
      if(event.key=='Enter'){
        console.log(event.key);
        const name = document.querySelector('.modal input').value;
        if(i==highscore.length){
          highscore.push({
            name: name,
            minutes :minutes,
            seconds: seconds
          })
        }
        else{
          for(let j = highscore.length-1;j>=i;j--){
            highscore[j] = highscore[j-1];
          }
          highscore[i] = {
            name: name,
            minutes :minutes,
            seconds: seconds
          }
        }
        localStorage.setItem("highscore",JSON.stringify(highscore));
        const overlay = document.querySelector('.overlay');
        overlay.style.display = "none";
        const modal = document.querySelector('.modal');
        modal.style.display = "none";
      }
    })
  }
}
function onTileRightClick(event) {
  event.preventDefault();
  placeflag(event.target.id);
  if(!started){
    started = true;
    stop = setInterval(() => {
      if(gameover) return;
      time++;
      document.querySelector('#zero').style.backgroundImage = `url(assets/Time_${time%10}.svg)`;
      if (time > 9 && time <= 99)
        document.querySelector('#ten').style.backgroundImage = `url(assets/Time_${parseInt(time/10)}.svg)`;
      if (time > 99) {
        document.querySelector('#ten').style.backgroundImage = `url(assets/Time_${parseInt(time/10)%10}.svg)`;
        document.querySelector('#hundred').style.backgroundImage = `url(assets/Time_${parseInt(time/100)}.svg)`;
      }
    }, 1000);
  }
  if(visited.size == 16*16 - 40){
    gameover = true;
    for (let i = 0; i < play.length; i++) {
      play[i].removeEventListener("contextmenu", onTileRightClick);
      play[i].removeEventListener("click", onTileLeftClick);
    }
    clearInterval(stop);
    gameWon();
  }
}
function onTileLeftClick(event) {
  playmove(event.target.id);
  if(!started){
    started = true;
    stop = setInterval(() => {
      if(gameover) return;
      time++;
      document.querySelector('#zero').style.backgroundImage = `url(assets/Time_${time%10}.svg)`;
      if (time > 9 && time <= 99)
        document.querySelector('#ten').style.backgroundImage = `url(assets/Time_${parseInt(time/10)}.svg)`;
      if (time > 99) {
        document.querySelector('#ten').style.backgroundImage = `url(assets/Time_${parseInt(time/10)%10}.svg)`;
        document.querySelector('#hundred').style.backgroundImage = `url(assets/Time_${parseInt(time/100)}.svg)`;
      }
    }, 1000);
  }
  if(visited.size == 16*16 - 40){
    gameover = true;
    for (let i = 0; i < play.length; i++) {
      play[i].removeEventListener("contextmenu", onTileRightClick);
      play[i].removeEventListener("click", onTileLeftClick);
    }
    clearInterval(stop);
    gameWon();
  }
}

for (let i = 0; i < play.length; i++) {
  play[i].addEventListener("contextmenu", onTileRightClick);
  play[i].addEventListener("click", onTileLeftClick);
}

const flaggedTiles = new Set();

function placeflag(pos) {
  const tile = document.querySelector(`#${pos}`);
  if (!flaggedTiles.has(pos)) {
    tile.style.backgroundImage = "url(/assets/Flag.svg)";
    flaggedTiles.add(pos);
  } else {
    tile.style.backgroundImage = "url(/assets/Default.svg)";
    flaggedTiles.delete(pos);
  }
}
  

function playmove(pos) {
  let i = Number(pos.substring(4,6));
  let j = Number(pos.substring(7,9));
  console.log(i + j);

  if (board[i][j] == -1) {
    document.querySelector(`#${pos}`).style.backgroundImage = "url(/assets/Mine.svg)";
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        if (board[i][j] == -1) {
          if (i < 10 && j < 10)
            document.querySelector(`#btn-0${i}-0${j}`).style.backgroundImage = "url(/assets/OverlayMine.svg)";
          else if (i < 10 && j >= 10)
            document.querySelector(`#btn-0${i}-${j}`).style.backgroundImage = "url(/assets/OverlayMine.svg)";
          else if (i >= 10 && j < 10)
            document.querySelector(`#btn-${i}-0${j}`).style.backgroundImage = "url(/assets/OverlayMine.svg)";
          else
            document.querySelector(`#btn-${i}-${j}`).style.backgroundImage = "url(/assets/OverlayMine.svg)";
        }
      }
    }
    document.querySelector(`#${pos}`).style.backgroundImage = "url(/assets/Mine.svg)"; 
    gameover = true;
    for (let i = 0; i < play.length; i++) {
      play[i].removeEventListener("contextmenu", onTileRightClick);
      play[i].removeEventListener("click", onTileLeftClick);
    }

    clearInterval(stop);

  } else {
    revealTiles(i, j);
  }
}

function revealTiles(i, j) {
  let tile, key;
  if (i < 10 && j < 10)
    key = `0${i}-0${j}`;
  else if (i < 10 && j >= 10)
    key = `0${i}-${j}`;
  else if (i >= 10 && j < 10)
    key = `${i}-0${j}`;
  else
    key = `${i}-${j}`;

  tile = document.querySelector(`#btn-${key}`);
  if (visited.has(key)) return;
  visited.add(key);
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

document.addEventListener("keydown", (event) => {
  if(event.key == 'r'){
    location.reload();
  }
} )