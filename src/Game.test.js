/**
 * @jest-environment jsdom
 */
import { checkWinner } from "./Game"
import { jest } from "@jest/globals"

beforeEach(() => {
  jest.clearAllMocks()
})

test("checkWinner correctly determines draw", () => {
  const board = {}
  board.isAllShipsSunk = jest.fn().mockReturnValue(true)
  expect(checkWinner(board, board)).toBe("Draw")
})

test("checkWinner correctly determines winner", () => {
  const board1 = {}
  board1.isAllShipsSunk = jest.fn().mockReturnValue(true)
  const board2 = {}
  board2.isAllShipsSunk = jest.fn().mockReturnValue(false)
  expect(checkWinner(board1, board2)).toBe("AI")
})
