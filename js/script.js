/**
 *  Project: Tic Tac Toe
 *  Author: David Kirshon
 */

// gameboard object
    // create gameboard, open spots, valid placement

const gameBoardGrid = document.querySelector('.game-board');

const gameBoard = (() => {
    const board = ['x','o','x',,'x','o','x','o','x']; // ...Array(9)

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

    const setScore = () => {};
    const setPlayerTurn = () => {};

    const pickSpot = () => {
        Array.from(gameBoardGrid.children).forEach(spot => {
            if(!(spot.textContent)) {
            spot.addEventListener('click', selectSpot);
            spot.classList.add('hoverOnSpot');
            }
        });

        function selectSpot() {
            gameBoard.setSpot(symbol, this.getAttribute('data-spot-number'));
            Array.from(gameBoardGrid.children).forEach(spot => {
                spot.removeEventListener('click', selectSpot);
                spot.classList.remove('hoverOnSpot');
            });
        };
    };

    return {getName, getPlayerTurn, getScore, getSymbol, 
        setScore, setPlayerTurn, 
        pickSpot};
};


// game object
    // game logic, win logic, game message 
const playGame = () => {
    const init = () => {};
    const checkWin = () => {};
    const gameMessage = () => {};
    const endGame = () => {};

    return {init, checkWin, gameMessage};
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
    return {drawBoard};
})();

displayController.drawBoard();
const playerOne = player('Player 1', 'x');
playerOne.pickSpot();