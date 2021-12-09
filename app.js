import { player_choose } from "./config.js";
import { gameboard } from "./config.js";
import { winning_message } from "./config.js";
import { prev_btn } from "./config.js";
import { restart_btn } from "./config.js";
import { next_btn } from "./config.js";
import { cells } from "./config.js";

const move_x = "X"
const move_o = "O"
let player_move

let board = ['', '', '', '', '', '', '', '', '']; //array board to place players symbols
let moved = [['', '', '', '', '', '', '', '', '']]; //array move to place history of turns

const winning_pattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const handleClick = (e) => {
  const div_cell = e.target
  const current_move = player_move ? move_o : move_x

  // Place Move to board

  board[div_cell.dataset.cell] = current_move;
  placeMove (board, div_cell, current_move)
  
  // save move to history

  saveMove();

  // swap move

  swapMove()

  // check if win or draw

  if (checkWin(current_move)) {
    action_turn.innerText = ""
    winning_message.innerHTML = `Player ${player_move ? "X" : "O"} Win!!! `
    for (const cell of cells) {
      if (cell.textContent === "" || cell.e !== "") {
        cell.style.cursor = "not-allowed"
      }
      cell.removeEventListener('click', handleClick)
    } 
    //save number of moves
    showHistory()
    player_move = moved.length;
  } else if (checkDraw()){
    action_turn.innerText = ""
    winning_message.innerHTML = "Draw Match!!!"
    for (const cell of cells) {
      if(cell.e !== "") {
        cell.style.cursor = "not-allowed"
      }
      cell.removeEventListener('click', handleClick)
    }
    //save number of moves
    showHistory()
    player_move = moved.length
  }
}

//game for choosing player symbol
const choosePlayer = () => {
  choose_x_btn.addEventListener('click', function () {
  player_choose.style.display = "none"
  action_turn.innerText = "X's player turn"
  })

  choose_o_btn.addEventListener('click', function () {
    player_choose.style.display = "none"
    action_turn.innerText = "O's player turn"
    player_move = !player_move
  })
}

choosePlayer()

//code for placing the symbol/moves into the gameboard
const placeMove = (board, div_cell, current_move) => {

  div_cell.classList.add(current_move)
  for (let i = 0; i < board.length ; i++) {
    gameboard.children[i].innerText = board[i]
  }
  restart_btn.style.display = "block"
}


const swapMove = () => {
  player_move = !player_move
  player_move ? action_turn.innerText = "O's player turn" : action_turn.innerText = "X's player turn"
}

const gameStart = () => {
  hideHistory()
  for (const cell of cells) {
    cell.addEventListener('click', handleClick, {once:true})
  }

  // Restart The game
  
  // hide restart button when start the game

  restart_btn.style.display = "none"

  const restartGame = () => {
    location.reload();
  }
  
  restart_btn.addEventListener("click", restartGame);
}

const checkWin = (current_move) => {
  return winning_pattern.some(combination => {
  let win = combination.every(index => {
  return cells[index].classList.contains(current_move)
    })
    
    if (win) {
      combination.forEach(index => {
        cells[index].className = "winning_pattern"
      });
      return true
    }

  })
}

const checkDraw = () => {
  return [...cells].every(cell => {
    return cell.classList.contains(move_x) || cell.classList .contains(move_o)
  })
}

const hideHistory = () => {
  prev_btn.style.display = "none"
  next_btn.style.display = "none"
}

const showHistory = () => {
  prev_btn.style.display = "block"
  next_btn.style.display = "block"
  next_btn.setAttribute("disabled", "true");
  next_btn.style.cursor = "not-allowed"
  prev_btn.addEventListener("click", PreviousMove);
  next_btn.addEventListener("click", NextMove);
}

const saveMove = () => {
  moved.push([...board])
}

const showHistoryMove = (board) => {
  //clear cells
  for (let i = 0; i <= board.length - 1 ; i++) {
    gameboard.children[i].innerText = board[i]
  }
  if (player_move < moved.length) {
    next_btn.style.cursor = "pointer"
    next_btn.removeAttribute("disabled");
  }
  if (player_move > 1) {
    prev_btn.style.cursor = "pointer"
    prev_btn.removeAttribute("disabled");
  }

}

const PreviousMove = () => {
  showHistoryMove(moved[--player_move - 1]);
  if (player_move <= 1) {
    prev_btn.setAttribute("disabled", true);
    prev_btn.style.cursor = "not-allowed"
  }
}
const NextMove = () => {
  showHistoryMove(moved[player_move++]);
  if (player_move >= moved.length) {
    next_btn.setAttribute("disabled", true);
    next_btn.style.cursor = "not-allowed"
  }
}


gameStart ()