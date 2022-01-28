/**
 *  Project: Tic Tac Toe
 *  Author: David Kirshon
 */

// gameboard object
    // create gameboard, open spots, valid placement

const gameBoardGrid = document.querySelector('.game-board');

const gameBoard = (() => {
    const board = [...Array(9)]

    const getBoard = () => board;
    const getOpenSpots = () => {};
    const getFilledSpots = () => {};

    const setSpot = (symbol, location) => {board[location] = symbol};

    return {getBoard, getFilledSpots, getOpenSpots, setSpot};
})();

// player objects
    // names, x or o, scores, turn
const player = (name, symbol) => {
    let score = 0;
    let playerTurn = false;

    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;
    const getPlayerTurn = () => playerTurn;

    const giveWinPoint = () => {score++};
    const setPlayerTurn = (turn) => {playerTurn = turn};



    return {getName, getPlayerTurn, getScore, getSymbol,
        giveWinPoint, setPlayerTurn};
};

// display object

const displayController = (() => {
    
    const drawBoard = () => {
        gameBoard.getBoard().forEach( (spot, i) => {
            if(spot) {
                const gameBoardGridSpot = gameBoardGrid.children[i];
                gameBoardGridSpot.textContent = spot;
            }
        });
    };

    const displayMessage = (message) => {
        const messageArea = document.querySelector('.game-messages');
        messageArea.textContent = message;
    };
    return {drawBoard, displayMessage};
})();

// game object
    // game logic, win logic, game message 
    const playGame = (() => {

        displayController.drawBoard();
        const playerOne = player('Player 1', 'x');
        const playerTwo = player('Player 2', 'o');
        let currentPlayer = playerOne;
        let otherPlayer = playerTwo;
        let gameOver = false;
        let gameOutcomeIsWin = false;
    
        const init = () => {
            pickSpot();
        };

        const pickSpot = () => {
            const currentSymbol = currentPlayer.getSymbol();
    
            Array.from(gameBoardGrid.children).forEach(spot => {
                if(!(spot.textContent)) {
                spot.addEventListener('click', selectSpot);
                spot.classList.add('hoverOnSpot');
                }
            });
    
            function selectSpot() {
                gameBoard.setSpot(currentSymbol, this.getAttribute('data-spot-number'));
                Array.from(gameBoardGrid.children).forEach(spot => {
                    spot.removeEventListener('click', selectSpot);
                    spot.classList.remove('hoverOnSpot');
                });
                displayController.drawBoard();

                if(checkWin()){
                    gameOutcomeIsWin = true;
                    endGame();
                } else if (checkTie()) {
                    endGame();
                } else{
                    const swapPlayer = currentPlayer;
                    currentPlayer = otherPlayer;
                    otherPlayer = swapPlayer;
                    pickSpot();
                }
            };
        };

        const checkWin = () => {
            const currentBoard = gameBoard.getBoard();
            if((currentBoard[0] && currentBoard[0] === currentBoard[1] && currentBoard[1] === currentBoard[2]) ||
            (currentBoard[0] && currentBoard[0] === currentBoard[3] && currentBoard[3] === currentBoard[6]) ||
            (currentBoard[0] && currentBoard[0] === currentBoard[4] && currentBoard[4] === currentBoard[8]) ||
            (currentBoard[1] && currentBoard[1] === currentBoard[4] && currentBoard[4] === currentBoard[7]) ||
            (currentBoard[2] && currentBoard[2] === currentBoard[4] && currentBoard[4] === currentBoard[6]) ||
            (currentBoard[2] && currentBoard[2] === currentBoard[5] && currentBoard[5] === currentBoard[8]) ||
            (currentBoard[3] && currentBoard[3] === currentBoard[4] && currentBoard[4] === currentBoard[5]) ||
            (currentBoard[6] && currentBoard[6] === currentBoard[7] && currentBoard[7] === currentBoard[8])) {
                return true;
            } else {
                return false;
            }
        };

        const checkTie = () => {
            const currentBoard = gameBoard.getBoard();
            if (currentBoard.includes(undefined)) {
                return false;
            } else {
                return true;
            }
        }
        
        const endGame = () => {
            gameOver = true;
            if (gameOutcomeIsWin) {
                currentPlayer.giveWinPoint();
                gameMessage();
            } else {
                gameMessage();
            }
        };

        const gameMessage = () => {
                let messageString = '';
                if(gameOver && gameOutcomeIsWin) {
                    messageString = `You win ${currentPlayer.getName()}!
                    The score is ${currentPlayer.getName()}: ${currentPlayer.getScore()}
                    ${otherPlayer.getName()}: ${otherPlayer.getScore()}`;
                } else {
                    messageString = `The game is a tie!
                    The score is ${currentPlayer.getName()}: ${currentPlayer.getScore()}
                    ${otherPlayer.getName()}: ${otherPlayer.getScore()}`;
                }
                displayController.displayMessage(messageString);
            };

        return {init};
    })();

playGame.init();