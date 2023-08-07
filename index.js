var State;
(function (State) {
    State[State["Empty"] = 0] = "Empty";
    State[State["X"] = 1] = "X";
    State[State["O"] = 2] = "O";
})(State || (State = {}));
var currentState = State.X;
var message = $('#message');
var domBoard = $('#board');
var board = [];
var buttonRestart = $('#button-restart');
buttonRestart.hide();
var gameEnded = false;
function restart() {
    console.log('restarting');
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            SetState(board[y][x], State.Empty);
        }
    }
    currentState = State.X;
    message.text("X's Turn!");
    gameEnded = false;
    buttonRestart.hide();
}
buttonRestart.on('click', restart);
var Cell = /** @class */ (function () {
    function Cell(parent) {
        var _this = this;
        this.state = State.Empty;
        this.elem = $('<div></div>').addClass('cell');
        parent.append(this.elem);
        this.elem.on('click', function () { SetState(_this, currentState); });
    }
    return Cell;
}());
function CheckBoard() {
    if (gameEnded) {
        return;
    }
    var rows = [
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]]
    ];
    var columns = [
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]]
    ];
    var diagonals = [
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]]
    ];
    var winConditions = rows.concat(columns).concat(diagonals);
    var xWins = winConditions.some(function (condition) { return condition.filter(function (cell) { return cell.state === State.X; }).length === 3; });
    var oWins = winConditions.some(function (condition) { return condition.filter(function (cell) { return cell.state === State.O; }).length === 3; });
    var noEmpties = !(board.some(function (row) { return row.filter(function (cell) { return cell.state === State.Empty; }).length > 0; }));
    if (noEmpties && !oWins && !xWins) {
        message.text('Draw!');
        buttonRestart.show();
        gameEnded = true;
    }
    else if (oWins) {
        message.text('O Wins!');
        buttonRestart.show();
        gameEnded = true;
    }
    else if (xWins) {
        message.text('X Wins!');
        buttonRestart.show();
        gameEnded = true;
    }
    else {
        message.text(currentState === State.X ? "X's Turn!" : "O's Turn!");
    }
}
function SetState(cell, state) {
    if (state === State.Empty) {
        cell.state = State.Empty;
        cell.elem.removeClass('x o');
    }
    if (!gameEnded) {
        if (cell.state !== State.Empty) {
            return;
        }
        else if (state === State.O) {
            cell.state = State.O;
            cell.elem.addClass('o');
            currentState = State.X;
        }
        else if (state === State.X) {
            cell.state = State.X;
            cell.elem.addClass('x');
            currentState = State.O;
        }
        CheckBoard();
    }
}
for (var y = 0; y < 3; y++) {
    board[y] = [];
    for (var x = 0; x < 3; x++) {
        board[y][x] = new Cell(domBoard);
    }
}
