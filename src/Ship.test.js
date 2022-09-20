import Ship from "./Ship"
test("new Ship actually creates an object with a hull array of correct length", () => {
  expect(new Ship(5).hull).toHaveLength(5)
})

test('Ship hit() method marks correct position in array as "hit"', () => {
  const ship = new Ship(2)
  ship.hit(0)
  expect(ship.hull).toEqual([true, false])
})

describe("isSunk() function", () => {
  test("newly created ship is not sunk", () => {
    const ship = new Ship(1)
    expect(ship.isSunk).toBe(false)
  })
  test("ship with all points hit is sunk", () => {
    const sunkShip = new Ship(1)
    sunkShip.hit(0)
    expect(sunkShip.isSunk).toBe(true)
  })
})
