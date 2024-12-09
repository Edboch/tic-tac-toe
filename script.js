const makeGameBoard = () => {
    let board = Array(9).fill('');

    const getBoard = () => board;
    const setMarker = (mark, index) => {
        board[index] = mark;
    };
    const clearBoard = () => { board.fill(''); };
    return {getBoard,setMarker,clearBoard};
};

const makePlayer = (name,marker) => {{name,marker}};

const gameController = (() => {
    const player1 = makePlayer('Player 1','X');
    const player2 = makePlayer('Player 2','O');
    const gameBoard = makeGameBoard();
    let playerTurn = "X";
    let winner;

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

    const checkDraw = () => {gameBoard.getBoard().every((value)=>{value!=''});};

    const changeTurn = () => {
        playerTurn = playerTurn === 'X'? 'O':'X';
    }

    const playTurn = (choice) => {
        const board = gameBoard.getBoard();
        const index = parseInt(choice);
         console.log(gameBoard.getBoard())
        if (board[index] == '') {
            gameBoard.setMarker(playerTurn,index);
             console.log(gameBoard.getBoard());
        } else {
             console.log('Already selected, please choose again')
            return;
        }

        if (checkWin()) {
             console.log(`winner: ${winner}`);
            return;
        }

        if (checkDraw()){
             console.log('Tis a draw');
            return;
        }

        changeTurn();
         console.log(`${playerTurn}'s Turn`);
    }

    const startGame = () => {
         console.log(`Begin! ${playerTurn} starts`);
    }
    return {startGame,playTurn};
})();

gameController.startGame();