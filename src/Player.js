export default class Player {
  attack(coord, board) {
    const [x, y] = coord
    board.receiveAttack(x, y)
  }

  aiAttack(board) {
    const x = Math.floor(Math.random() * board.board.length)
    const y = Math.floor(Math.random() * board.board.length)
    if (board.isLegal(x, y)) {
      board.receiveAttack(x, y)
    } else {
      this.aiAttack(board)
    }
  }
}
