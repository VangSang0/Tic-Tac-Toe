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
        if (board[row][column].getValue() === '') {
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
    let value = '';

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

    let gameOver = false;
    let cat = false;
    let movesCounter = 0;
    const board = Gameboard();
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
    const isGameOver = () => gameOver;
    const isCat = () => cat;

    const checkWin = (board, currentPlayerMove) => {
        const size = 3;
        // Check rows
        for (let row = 0; row < size; row++) {
            if (
                currentPlayerMove === board[row][0].getValue() &&
                currentPlayerMove === board[row][1].getValue() &&
                currentPlayerMove === board[row][2].getValue()
            ) {
                return true;
            }
        }
        // Check columns
        for (let column = 0; column < size; column++) {
            if (
                currentPlayerMove === board[0][column].getValue() &&
                currentPlayerMove === board[1][column].getValue() &&
                currentPlayerMove === board[2][column].getValue()
            ) {
                return true;
            }
        }
        // Check diagonals
        if (
            board[0][0].getValue() === currentPlayerMove &&
            board[1][1].getValue() === currentPlayerMove &&
            board[2][2].getValue() === currentPlayerMove
        ) {
            return true;
        }
        if (
            board[0][2].getValue() === currentPlayerMove &&
            board[1][1].getValue() === currentPlayerMove &&
            board[2][0].getValue() === currentPlayerMove
        ) {
            return true;
        }
        return false;
    };

    // Placing move into cells picked
    const playRound = (row, column) => {
        const player = getActivePlayer();
        const madeMove = board.makeMove(row, column, player.move);
        if(!madeMove){
            return; 
        }
        else{
            movesCounter++ ;
        }
        
        const currentPlayerWin = checkWin(board.getBoard(), player.move);
        if (currentPlayerWin){
            gameOver = true;
        }
        else if(movesCounter === 9 && !currentPlayerWin){
            gameOver = true;
            cat = true;
        }
        switchPlayerTurn();
        
    }
    return { playRound, getActivePlayer, getBoard : board.getBoard, isGameOver, isCat }

}

function screenController(){
    const playersDiv = document.querySelector('.players');
    playersDiv.style.display = 'flex';
    let firstPlayerName ='Player 1';
    let secondPlayerName = 'Player 2';
    let game = GameController();
    const submitNamesButton = document.querySelector('.submit-names-btn');

    submitNamesButton.addEventListener('click', () => {
        const firstPlayer = document.getElementById('player-1');
        const secondPlayer = document.getElementById('player-2');
        if (!firstPlayer.value || !secondPlayer.value) {
            alert('Please enter both names!');
        } else {
            firstPlayerName = firstPlayer.value;
            secondPlayerName = secondPlayer.value;
            game = GameController(firstPlayerName, secondPlayerName); 
            playersDiv.style.display = 'none';
            updateScreen(); 
        }
    });
    const gameDisplay = document.querySelector('.gameboard');
    const currentPlayerDisplay = document.querySelector('.turn-display');
    const restartButton = document.querySelector('.restart')


    const updateScreen = () => {
        gameDisplay.textContent = ''

        const board = game.getBoard();
        const currentPlayer = game.getActivePlayer();
        currentPlayerDisplay.textContent = `${currentPlayer.name}'s turn`
        if (game.isGameOver() && !game.isCat()) {
            const winner = game.getActivePlayer().name === firstPlayerName ? secondPlayerName : firstPlayerName;
            currentPlayerDisplay.textContent = `${winner} wins! 🎉`;
            restartButton.style.display = 'flex';
            restartButton.addEventListener('click', () => {
                restartButton.style.display = 'none';
                game = GameController(firstPlayerName, secondPlayerName);
                updateScreen();
            })
        }
        else if (game.isGameOver() && game.isCat()){
            currentPlayerDisplay.textContent = 'CAT! 🐈'
            restartButton.style.display = 'flex';
            restartButton.addEventListener('click', () => {
                restartButton.style.display = 'none';
                game = GameController(firstPlayerName, secondPlayerName);
                updateScreen();
            })
        }

    
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                gameDisplay.appendChild(cellButton);
            })
        });
    }

    function clickHandlerBoard(e){
        if(game.isGameOver()) return;
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedColumn && !selectedRow) return; 
        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }


    gameDisplay.addEventListener('click', clickHandlerBoard);

    updateScreen();


}

screenController()