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
    const setName = (newName) => name=newName;
    return {getName,getMarker,setName}
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
        const name = playerTurn.getName();
        const marker = playerTurn.getMarker();
        if (board[index] == '') {
            gameBoard.setMarker(marker,index);
        } else if (choice === -1) {
            return `${name}'s (${marker}) Turn`;
        }else {
            return `Already selected, please choose again (${marker}'s turn)`;
        }
        if (checkWin()) { 
            return `Winner: ${name} (${marker})`;
        }

        if (checkDraw()) { return 'Tis a draw'; }

        changeTurn();
        return `${playerTurn.getName()}'s (${playerTurn.getMarker()}) Turn`;
    }

    const startGame = () => {
        playerTurn = Math.random() < 0.5? player1:player2;
    }

    const newGame = () => {
        gameBoard.clearBoard();
        startGame();
        winner = null;
    }

    const changePlayerName = (p1,p2) => {
        if (p1 != '') {
            player1.setName(p1);
        }
        if (p2 != '') {
            player2.setName(p2);
        }
    }

    const hasWinner = () => winner;
    return {startGame,playTurn,getPlayerTurn,
            newGame,hasWinner,changePlayerName};
});

const displayController = (() => {
    const gameGrid = document.querySelector('.game');
    const infoPanel = document.querySelector('.info-panel')
    const restartBtn = document.querySelector('.restart');
    const renameBtn = document.querySelector('.rename');
    const dialog = document.querySelector('dialog');
    const playerOneInput = dialog.querySelector('#player-one')
    const playerTwoInput = dialog.querySelector('#player-two')
    const submitNamesBtn = dialog.querySelector('.submit-names');
    const cancelModalBtn = dialog.querySelector('.cancel-modal');

    const gameController = makeGameController();
    gameController.startGame();
    let currentTurn = gameController.getPlayerTurn();
    dialog.showModal();
    infoPanel.textContent = `${currentTurn.getMarker()}'s starts`;

    const clearModal = () => {
        playerOneInput.value = '';
        playerTwoInput.value = '';
    }

    const restartGame = ()=>{
        const cells = gameGrid.querySelectorAll('.cell');
        cells.forEach(cell => cell.innerHTML = '');
        gameController.newGame();
        currentTurn = gameController.getPlayerTurn();
        infoPanel.textContent = `${currentTurn.getMarker()}'s Turn`;
    };

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

    restartBtn.addEventListener('click', restartGame);

    renameBtn.addEventListener('click', () => {
        dialog.showModal()
    });

    cancelModalBtn.addEventListener('click', () => {
        clearModal();
        dialog.close();
    });

    submitNamesBtn.addEventListener('click', () => {
        const p1Name = playerOneInput.value;
        const p2Name = playerTwoInput.value;
        gameController.changePlayerName(p1Name,p2Name);
        restartGame();
        clearModal();
        dialog.close();
    });
})();
