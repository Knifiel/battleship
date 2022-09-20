import Player from "./Player"
import jest from "jest-mock"
import Gameboard from "./Gameboard"

const mockIsLegal = jest
  .spyOn(Gameboard.prototype, "isLegal")
  .mockImplementation(() => true)

const mockReceiveAttack = jest.spyOn(Gameboard.prototype, "receiveAttack")

beforeEach(() => {
  mockIsLegal.mockClear()
  mockReceiveAttack.mockClear()
})

test('Player attack should send coordinates through "receiveAttack" method at enemy gameboard', () => {
  const player = new Player()
  const board = new Gameboard()
  player.attack([0, 0], board)
  expect(mockReceiveAttack).toBeCalledWith(0, 0)
})

test("Ai player attack should call receiveAttack", () => {
  const aiPlayer = new Player()
  const board = new Gameboard()
  aiPlayer.aiAttack(board)
  expect(mockIsLegal).toHaveBeenCalled()
  expect(mockReceiveAttack).toHaveBeenCalled()
})
