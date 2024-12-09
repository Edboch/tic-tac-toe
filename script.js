const makeGameBoard = () => {
    let board = Array(9).fill('');

    const getBoard = () => board;
    const setMarker = (mark, index) => {
        board[index] = mark;
    };
    const clearBoard = () => { board.fill(''); };
    return {getBoard,setMarker,clearBoard};
};

const makePlayer = (name,marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    return {getName,getMarker}
};

const makeGameController = (() => {
    const player1 = makePlayer('Player 1','X');
    const player2 = makePlayer('Player 2','O');
    const gameBoard = makeGameBoard();
    let playerTurn;
    let winner;

    const getPlayerTurn = () => playerTurn;

    const checkWin = () => {
        const board = gameBoard.getBoard();
        const winCombos = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for (const combo of winCombos) {
            const [a,b,c] = combo;
            if (board[a] != '' &&board[a] === board[b] && board[b] === board[c]) {
                winner = board[a];
                return true;
            }
        };
        return false;
    };

    const checkDraw = () => gameBoard.getBoard().every((value)=>value!='');

    const changeTurn = () => {
        playerTurn = playerTurn === player1? player2:player1;
    }

    const playTurn = (choice) => {
        const board = gameBoard.getBoard();
        const index = parseInt(choice);
        if (board[index] == '') {
            gameBoard.setMarker(playerTurn.getMarker(),index);
        } else if (choice === -1) {
            return `${playerTurn.getMarker()}'s Turn`;
        }else {
            return `Already selected, please choose again (${playerTurn.getMarker()}'s turn)`;
        }
        if (checkWin()) { return `Winner: ${playerTurn.getName()} (${playerTurn.getMarker()})`; }

        if (checkDraw()) { return 'Tis a draw'; }

        changeTurn();
        return `${playerTurn.getMarker()}'s Turn`;
    }

    const startGame = () => {
        playerTurn = Math.random() < 0.5? player1:player2;
    }

    const newGame = () => {
        gameBoard.clearBoard();
        startGame();
        winner = null;
    }

    const hasWinner = () => winner;
    return {startGame,playTurn,getPlayerTurn,newGame,hasWinner};
});

const displayController = (() => {
    const gameController = makeGameController();
    gameController.startGame();
    let currentTurn = gameController.getPlayerTurn();

    const gameGrid = document.querySelector('.game');
    const restartBtn = document.querySelector('.restart');
    const infoPanel = document.querySelector('.info-panel')

    infoPanel.textContent = `${currentTurn.getMarker()}'s Turn`;

    gameGrid.addEventListener('click', (e)=>{
        if (gameController.hasWinner()){return;}
        const chosenCell = e.target;
        const chosenIndex = chosenCell.getAttribute('data-index')-1;
        infoPanel.textContent = gameController.playTurn(chosenIndex);

        if (chosenCell.className == 'cell' && chosenCell.textContent== '') {
            chosenCell.textContent = currentTurn.getMarker();
            currentTurn = gameController.getPlayerTurn();
        }
    })

    restartBtn.addEventListener('click', ()=>{
        const cells = gameGrid.querySelectorAll('.cell');
        cells.forEach(cell => cell.innerHTML = '');
        gameController.newGame();
        currentTurn = gameController.getPlayerTurn();
        infoPanel.textContent = `${currentTurn.getMarker()}'s Turn`;
    })
})();
