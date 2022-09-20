import { newGame, round } from "./Game"

const app = document.getElementById("app")

export const newGameMenu = () => {
  const h1 = document.createElement("h1")
  h1.textContent = "New game"
  h1.classList.add("newGame")
  const label = document.createElement("label")
  label.textContent = "Difficulty: "
  const select = document.createElement("select")
  label.appendChild(select)
  select.id = "difficulty"
  select.innerHTML = `
    <option value="10, 10">Standard boards 10x10</option>
    <option value="12, 12">Large boards 12x12</option>
    <option value="8, 8">Small boards 8x8</option>
    <option value="8, 10">Hard - you on 8x8, ai on 10x10</option>
    <option value="8, 12">Very hard - you on 8x8, ai on 12x12</option>
    <option value="10,8">Easy - you on 10x10, ai on 8x8</option>
    <option value="12,8">Very easy - you on 12x12, ai on 8x8</option>
    `
  app.appendChild(h1)
  app.appendChild(label)
  h1.addEventListener("click", () => {
    newGame(select.value.split(", "))
  })
}

export const drawBoards = (player, ai) => {
  while (app.firstChild) {
    app.firstChild.remove()
  }
  const playerBoard = player.board
  const aiBoard = ai.board
  const aiDiv = document.createElement("div")
  const playerDiv = document.createElement("div")
  const aiHeading = document.createElement("h3")
  aiHeading.textContent = "Enemy board"
  const playerHeading = document.createElement("h3")
  playerHeading.textContent = "Player board"
  app.appendChild(aiHeading)
  app.appendChild(aiDiv)
  app.appendChild(playerHeading)
  app.appendChild(playerDiv)
  aiDiv.classList.add("aiBoard")
  playerDiv.classList.add("playerBoard")
  fillDivFromGameboard(aiDiv, aiBoard, "ai")
  fillDivFromGameboard(playerDiv, playerBoard)

  playerDiv.style.gridTemplateColumns = `repeat(${playerBoard.length}, 20px)`
  playerDiv.style.gridTemplateRows = `repeat(${playerBoard.length}, 20px)`

  aiDiv.style.gridTemplateColumns = `repeat(${aiBoard.length}, 20px)`
  aiDiv.style.gridTemplateRows = `repeat(${aiBoard.length}, 20px)`
}

export const inputPlayerBoard = (board) => {
  while (app.firstChild) {
    app.firstChild.remove()
  }
  const h1 = document.createElement("h1")
  h1.textContent = "Place your ships"
  app.appendChild(h1)
  const boardDiv = document.createElement("div")
  boardDiv.classList.add("playerBoard")
  boardDiv.classList.add('placingPhase')
  boardDiv.style.gridTemplateColumns = `repeat(${board.board.length}, 20px)`
  boardDiv.style.gridTemplateRows = `repeat(${board.board.length}, 20px)`
  makeBoardForShipSetup(board, boardDiv)
  app.appendChild(boardDiv)
  const prompt = document.createElement("span")
  app.appendChild(prompt)
  prompt.classList.add("prompt")
  const span = document.createElement("span")
  span.textContent = "Right click on square to change orientation"
  const span2 = document.createElement("span")
  span2.textContent = "Left click on square to place ships"
  app.appendChild(span)
  app.appendChild(span2)
}

function makeBoardForShipSetup(board, target) {
  board.board.forEach((array, x) => {
    array.forEach((square, y) => {
      const div = document.createElement("div")
      div.width = "20px"
      div.height = "20px"
      div.dataset.x = x
      div.dataset.y = y
      switch (square) {
        case null: {
          div.style.background = "white"
          div.classList.add("validSpace")
          break
        }
        default: {
          div.style.background = "blue"
          div.classList.add("playerShip")
          break
        }
      }
      div.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        return false
      })
      target.appendChild(div)
    })
  })
}

function fillDivFromGameboard(target, board, opMode = null) {
  board.forEach((array, x) => {
    array.forEach((square, y) => {
      const div = document.createElement("div")
      switch (square) {
        case null: {
          div.style.backgroundColor = "white"
          if (opMode === "ai") {
            div.classList.add("selectable")
            div.addEventListener("click", (e) => {
              e.preventDefault
              round(x, y)
            })
          }
          break
        }
        case "miss": {
          div.style.backgroundColor = "grey"
          break
        }
        default: {
          if (square.ship.hull[square.section] === false) {
            if (opMode !== "ai") {
              div.style.backgroundColor = "blue"
              div.classList.add("playerShip")
            } else {
              div.classList.add("selectable")
              div.style.backgroundColor = "white"
              div.addEventListener("click", (e) => {
                e.preventDefault
                round(x, y)
              })
            }
          } else {
            if (opMode !== "ai") {
              div.classList.add("playerShip")
            }
            div.style.backgroundColor = "red"
          }
        }
      }
      div.classList.add("boardSquare")
      div.style.width = "20px"
      div.style.height = "20px"
      target.appendChild(div)
    })
  })
}

export const gameEnd = (winner) => {
  while (app.firstChild) {
    app.firstChild.remove()
  }
  const h1 = document.createElement("h1")
  app.appendChild(h1)
  if (winner === "Draw") {
    h1.textContent = "Draw!"
  } else {
    h1.textContent = `${winner} won!`
  }
  newGameMenu()
}

export function populateBoards(player, ai, shipLengths = [5, 4, 3, 3, 2]) {
  if (shipLengths.length > 0) {
    inputPlayerBoard(player)
    const prompt = document.querySelector(".prompt")
    const validSpaces = document.querySelectorAll(".validSpace")
    const length = shipLengths.shift()
    prompt.textContent = `Please, place your ship of length ${length}`
    let direction = "vertical"
    validSpaces.forEach((square) => {
      const placement = { invalid: false }
      const x = Number(square.dataset.x)
      const y = Number(square.dataset.y)

      square.addEventListener("mouseover", (e) => {
        e.preventDefault()
        selectSquaresByOrientation(square, direction, length, placement)
      })

      square.addEventListener("mousedown", (e) => {
        e.preventDefault()
        if (e.button === 0) {
          if (placement.invalid === true) {
            const div = document.createElement("div")
            div.classList.add("error")
            div.textContent = "This placement is invalid."
            document.body.appendChild(div)
            div.style.position = "fixed"
            div.style.left = `${e.clientX + 10}px`
            div.style.top = `${e.clientY + 10}px`
            setTimeout(() => div.remove(), 500)
          } else {
            if (direction === "vertical") {
              player.addShip([x, y], [x + length - 1, y])
            } else {
              player.addShip([x, y], [x, y + length - 1])
            }
            populateBoards(player, ai, shipLengths)
          }
        }
        if (e.button === 2) {
          clearClasses("selected", "invalid")
          direction = direction === "vertical" ? "horizontal" : "vertical"
          selectSquaresByOrientation(square, direction, length, placement)
        }
      })

      square.addEventListener("mouseout", (e) => {
        e.preventDefault()
        clearClasses("selected", "invalid")
        placement.invalid = false
      })
    })
  } else {
    ai.populateAiBoard()
    app.animate({
        opacity: [1, 0, 1],
        }, 1000)
    setTimeout(() => {drawBoards(player, ai)}, 500)
  }
}

function selectSquaresByOrientation(square, direction, length, placement) {
  square.classList.add("selected")
  const x = Number(square.dataset.x)
  const y = Number(square.dataset.y)
  for (let i = 1; i < length; i++) {
    let endX, endY
    if (direction === "vertical") {
      endX = x + i
      endY = y
    } else {
      endX = x
      endY = y + i
    }
    const div = document.querySelector(`[data-x="${endX}"][data-y="${endY}"]`)
    if (div !== null && div.classList.contains("validSpace")) {
      div.classList.add("selected")
    }
    if (
      div === null ||
      (div !== null && div.classList.contains("playerShip"))
    ) {
      placement.invalid = true
      if (div !== null) {
        div.classList.add("invalid")
      }
    }
  }
}

function clearClasses(...classNames) {
  classNames.forEach((className) => {
    const toClear = [...document.querySelectorAll(`.${className}`)]
    toClear.forEach((e) => {
      e.classList.remove(className)
    })
  })
}
