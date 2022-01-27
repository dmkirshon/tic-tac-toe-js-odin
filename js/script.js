/**
 *  Project: Tic Tac Toe
 *  Author: David Kirshon
 */

// gameboard object
    // create gameboard, open spots, valid placement

const gameBoard = (() => {
    const board = ['x','o','x','o','x','o','x','o','x']; // ...Array(9)

    const getBoard = () => board;
    const getOpenSpots = () => {};
    const getFilledSpots = () => {};

    const setSpot = () => {};

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

    return {getName, getPlayerTurn, getScore, getSymbol, setScore, setPlayerTurn};
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
    const gameBoardGrid = document.querySelector('.game-board');
    
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