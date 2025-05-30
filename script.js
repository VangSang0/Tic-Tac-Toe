// Gameboard class
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Built the board
    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0 ; j < columns; j++){
            board[i].push(Cell());
        }
    }
    
    const getBoard = () => board;

    const makeMove = (row, column, move) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addShape(move);
            return true;
        }
        else{
            return false;
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, makeMove, printBoard }

}

function Cell() {
    let value = 0;

    const addShape = (move) => {
        value = move;
    };

    const getValue = () => value;

    return {
        addShape,
        getValue
    };
}

// GameController 
function GameController(
    playerOneName = 'Player 1',
    playerTwoName = 'Player 2'
){
    board = Gameboard();
    // set up our players
    const players = [
        {
            name: playerOneName,
            move: 'X'
        },
        {
            name: playerTwoName,
            move: 'O'
        }
    ];

    let activePlayer = players[0];

    // Changed player active
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    // Get the active player
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWin = (board, currentPlayerMove) => {
        const size = 3;
        for (let row = 0; row < size; row ++){
            if( currentPlayerMove === board[row][0].getValue() &&
                currentPlayerMove === board[row][1].getValue() &&
                currentPlayerMove === board[row][2].getValue()
            ){
                return true;
            }
        }

        for (let column = 0; column < size; column++){
            if( currentPlayerMove === board[0][column].getValue() &&
                currentPlayerMove === board[1][column].getValue() &&
                currentPlayerMove === board[2][column].getValue()
            ){
                return true;
            }
        }

        if( board[0][0].getValue() === currentPlayerMove &&
            board[1][1].getValue() === currentPlayerMove &&
            board[2][2].getValue() === currentPlayerMove
        ){
            return true
        }
        if( board[0][2].getValue() === currentPlayerMove &&
            board[1][1].getValue() === currentPlayerMove &&
            board[2][0].getValue() === currentPlayerMove
        ){
            return true
        }
        return false;

    }

    // Placing move into cells picked
    const playRound = (row, column) => {
        const player = getActivePlayer();
        console.log(
            `${player.name} attempts move into column ${row}, ${column}...`
        );
        const madeMove = board.makeMove(row, column, player.move);
        if(!madeMove){
            console.log('Invalid move! Spot has been taken')
        }
        else{
            console.log(`Successful move made by ${player.name}!`)
            switchPlayerTurn();
        }

        const currentPlayerWin = checkWin(board.getBoard(), player.move)
        if (currentPlayerWin){
            console.log(`${player.name} Has Won!`)
        }
        else{
            printNewRound();
        }

    }

    printNewRound();

    return { playRound, getActivePlayer, getBoard : board.getBoard }

}

const game = GameController();