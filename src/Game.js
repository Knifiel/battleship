import Player from "./Player"
import Gameboard from "./Gameboard"
import { drawBoards, gameEnd, populateBoards } from "./UI"

const player = new Player()
const ai = new Player()
let playerBoard
let aiBoard

export function newGame(sizes) {
  playerBoard = new Gameboard(Number(sizes[0]))
  aiBoard = new Gameboard(Number(sizes[1]))
  populateBoards(playerBoard, aiBoard)
}

export function round(...coord) {
  player.attack(coord, aiBoard)
  drawBoards(playerBoard, aiBoard)
  ai.aiAttack(playerBoard)
  drawBoards(playerBoard, aiBoard)
  if (playerBoard.isAllShipsSunk() || aiBoard.isAllShipsSunk()) {
    const winner = checkWinner(playerBoard, aiBoard)
    gameEnd(winner)
  }
}

export function checkWinner(board1, board2) {
  if (board1.isAllShipsSunk() && board2.isAllShipsSunk()) {
    return "Draw"
  } else {
    return board1.isAllShipsSunk() ? "AI" : "Player"
  }
}
