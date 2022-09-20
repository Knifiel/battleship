import Gameboard from "./Gameboard"

test("new Gameboard returns object", () => {
  expect(new Gameboard()).toBeInstanceOf(Gameboard)
})

describe("addShip method creates new ship of required length and associates it with board coordinates", () => {
  const board = new Gameboard(8)
  board.addShip([0, 0], [0, 4])
  board.addShip([2, 2], [5, 2])
  test("ship objects returned on all the correct coordinates", () => {
    expect(board.get(0, 0).ship).toBeTruthy()
    expect(board.get(0, 4).ship).toBeTruthy()
    expect(board.get(2, 2).ship).toBeTruthy()
    expect(board.get(5, 2).ship).toBeTruthy()
  })
  test("there are no ship object on wrong coordinates", () => {
    expect(board.get(1, 0)).toBeFalsy()
    expect(board.get(0, 6)).toBeFalsy()
  })
  test("Trying to set ship at square another ship occupies throws an error", () => {
    expect(() => {
      board.addShip([0, 0], [0, 1])
    }).toThrow("space is occupied")
  })
  test("Trying to set ship at square outside board throws an error", () => {
    expect(() => {
      board.addShip([0, 9], [0, 10])
    }).toThrow("outside of bounds")
  })
})

describe("receiveAttack method", () => {
  const board = new Gameboard()
  test('missing a shot should add "miss" value onto board coordinate', () => {
    board.receiveAttack(0, 0)
    expect(board.get(0, 0)).toBe("miss")
  })
  test("hitting a ship call ship.hit with correct arguments", () => {
    board.addShip([1, 1], [1, 2])
    board.receiveAttack(1, 1)
  })
})

describe("shipsIsSunk method", () => {
  test("if there is not sunk ships, return false", () => {
    const board = new Gameboard()
    board.addShip([0, 0], [0, 1])
    expect(board.isAllShipsSunk()).toBe(false)
  })
  test("if all ships are sunk, return true", () => {
    const board = new Gameboard()
    board.addShip([0, 0], [0, 1])
    board.receiveAttack(0, 0)
    board.receiveAttack(0, 1)
    expect(board.isAllShipsSunk()).toBe(true)
  })
})

describe("isLegal method returns true when you can attack said square, false when not", () => {
  const board = new Gameboard()
  board.addShip([0, 0], [0, 1])
  board.receiveAttack(0, 0)
  board.receiveAttack(1, 0)
  test("shooting at empty space is legal", () => {
    expect(board.isLegal(1, 1)).toBe(true)
  })
  test("shooting undamaged ship section is legal", () => {
    expect(board.isLegal(0, 1)).toBe(true)
  })
  test("shooting already shot empty square is illegal", () => {
    expect(board.isLegal(1, 0)).toBe(false)
  })
  test("shooting already shot ship square is illegal", () => {
    expect(board.isLegal(0, 0)).toBe(false)
  })
})

test("populateAiBoard always makes 5 ships", () => {
  const board = new Gameboard()
  board.populateAiBoard(board)
  expect(board.ships).toHaveLength(5)
})
