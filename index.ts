enum State { Empty, X, O }

let currentState: State = State.X
const message = $('#message')
const domBoard = $('#board')
const board: Cell[][] = []

const buttonRestart = $('#button-restart')
buttonRestart.hide()
let gameEnded: boolean = false

function restart (): void {
  console.log('restarting')
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      SetState(board[y][x], State.Empty)
    }
  }
  currentState = State.X
  message.text("X's Turn!")
  gameEnded = false
  buttonRestart.hide()
}

buttonRestart.on('click', restart)

class Cell {
  state: State
  elem: JQuery<HTMLElement>

  constructor (parent: JQuery<HTMLElement>) {
    this.state = State.Empty
    this.elem = $('<div></div>').addClass('cell')
    parent.append(this.elem)
    this.elem.on('click', () => { SetState(this, currentState) })
  }
}

function CheckBoard (): void {
  if (gameEnded) {
    return
  }
  const rows = [
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]]]

  const columns = [
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]]]

  const diagonals = [
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]]]

  const winConditions = rows.concat(columns).concat(diagonals)

  const xWins: boolean = winConditions.some(condition => condition.filter(cell => cell.state === State.X).length === 3)
  const oWins: boolean = winConditions.some(condition => condition.filter(cell => cell.state === State.O).length === 3)
  const noEmpties: boolean = !(board.some(row => row.filter(cell => cell.state === State.Empty).length > 0))

  if (noEmpties && !oWins && !xWins) {
    message.text('Draw!')
    buttonRestart.show()
    gameEnded = true
  } else if (oWins) {
    message.text('O Wins!')
    buttonRestart.show()
    gameEnded = true
  } else if (xWins) {
    message.text('X Wins!')
    buttonRestart.show()
    gameEnded = true
  } else {
    message.text(currentState === State.X ? "X's Turn!" : "O's Turn!")
  }
}

function SetState (cell: Cell, state: State): void {
  if (state === State.Empty) {
    cell.state = State.Empty
    cell.elem.removeClass('x o')
  }
  if (!gameEnded) {
    if (cell.state !== State.Empty) {
      return
    } else if (state === State.O) {
      cell.state = State.O
      cell.elem.addClass('o')
      currentState = State.X
    } else if (state === State.X) {
      cell.state = State.X
      cell.elem.addClass('x')
      currentState = State.O
    }
    CheckBoard()
  }
}

for (let y = 0; y < 3; y++) {
  board[y] = []
  for (let x = 0; x < 3; x++) {
    board[y][x] = new Cell(domBoard)
  }
}
