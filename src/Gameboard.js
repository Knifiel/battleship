import Ship from "./Ship"

export default class Gameboard {
  constructor(length = 10) {
    this.board = []
    this.ships = []
    for (let i = 0; i < length; i++) {
      this.board.push(new Array(length).fill(null))
    }
  }
  addShip(start, end) {
    const [startX, startY] = start
    const [endX, endY] = end
    if (endX > this.board.length - 1 || endY > this.board.length - 1) {
      throw Error("outside of bounds")
    }
    const shipLength = startX === endX ? endY - startY + 1 : endX - startX + 1
    const ship = new Ship(shipLength)
    for (let i = 0; i < shipLength; i++) {
      let x, y
      if (startX === endX) {
        x = startX
        y = startY + i
      } else if (startY === endY) {
        x = startX + i
        y = startY
      }
      if (this.get(x, y) !== null) {
        throw Error("space is occupied")
      }
      this.board[x][y] = { ship, section: i }
    }
    this.ships.push(ship)
    return this
  }

  get(x, y) {
    return this.board[x][y]
  }

  isLegal(x, y) {
    const loc = this.get(x, y)
    if (loc === "miss") {
      return false
    } else if (loc === null) {
      return true
    } else if (loc.ship.hull[loc.section] === false) {
      return true
    }
    return false
  }

  receiveAttack(x, y) {
    const location = this.board[x][y]
    if (location === null) {
      this.board[x][y] = "miss"
    } else if (typeof location === "object") {
      location.ship.hit(location.section)
    }
  }

  isAllShipsSunk() {
    const sunkShips = this.ships.filter((ship) => ship.isSunk === true)
    if (sunkShips.length === this.ships.length) {
      return true
    } else {
      return false
    }
  }

  populateAiBoard() {
    const shipLengths = [5, 4, 3, 3, 2]
    while (shipLengths.length > 0) {
      const length = shipLengths[0]
      const direction = Math.floor(Math.random() * 2)
      const x = Math.floor(Math.random() * this.board.length)
      const y = Math.floor(Math.random() * this.board.length)
      try {
        if (direction === 0) {
          this.addShip([x, y], [x, y + length - 1])
        } else {
          this.addShip([x, y], [x + length - 1, y])
        }
        shipLengths.shift()
      } catch (err) {
        if (err === "outside of bounds" || err === "space is occupied") {
          continue
        }
      }
    }
  }
}
