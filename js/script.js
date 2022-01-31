/**
 *  Project: Tic Tac Toe
 *  Author: David Kirshon
 */

// gameboard object
// create gameboard, open spots, valid placement

const gameBoardGrid = document.querySelector('.game-board');

const gameBoard = (() => {
    const board = [...Array(9)];

    const getBoard = () => board;
    const getOpenSpots = () => { };
    const getFilledSpots = () => { };

    const setSpot = (symbol, location) => { board[location] = symbol; };

    return { getBoard, getFilledSpots, getOpenSpots, setSpot };
})();

// player objects
// names, x or o, scores, turn
const player = (name, symbol, position) => {
    let score = 0;
    let playerTurn = false;

    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;
    const getPlayerTurn = () => playerTurn;
    const getPlayerPosition = () => position;

    const giveWinPoint = () => ++score;
    const setPlayerTurn = (turn) => { playerTurn = turn; };

    const isPlayerOne = (player) => position === 1 ? true: false;
    const isPlayerTwo = (player) => position === 2 ? true: false;


    return {
        getName, getPlayerTurn, getScore, getSymbol, getPlayerPosition,
        giveWinPoint, setPlayerTurn, isPlayerOne, isPlayerTwo
    };
};

// display object

const displayController = (() => {
    let inputPlayerOne;
    let inputPlayerTwo;

    const playerOneProfile = document.querySelector('.player-one-profile');
    const playerTwoProfile = document.querySelector('.player-two-profile');
    const startGameForm = document.querySelector('.form-start-game');

    startGameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        inputPlayerOne = document.getElementById('playerOne').value;
        inputPlayerTwo = document.getElementById('playerTwo').value;
        startGameForm.reset();
        startGameForm.hidden = true;
        playGame.init();
    });

    const drawBoard = () => {
        gameBoard.getBoard().forEach((spot, i) => {
            if (spot) {
                const gameBoardGridSpot = gameBoardGrid.children[i];
                gameBoardGridSpot.textContent = spot;
            }
        });
    };

    const displayName = (playerName, player) => {
        const playerProfile = grabPlayerProfile(player);

        const playerProfileName = playerProfile.querySelector('.player-profile-name');
        playerProfileName.textContent = playerName;
    };

    const displayScore = (playerScore, player) => {
        const playerProfile = grabPlayerProfile(player);

        const playerProfileScore = playerProfile.querySelector('.player-profile-score');
        playerProfileScore.textContent = `Score: ${playerScore}`;
    };

    const displaySymbol = (playerSymbol, player) => {
        const playerProfile = grabPlayerProfile(player);

        const playerProfileSymbol = playerProfile.querySelector('.player-profile-symbol');
        playerProfileSymbol.textContent = playerSymbol;
    };

    const highlightPlayer = (currentPlayer) => {
        if (currentPlayer.isPlayerOne()) {
            playerTwoProfile.classList.remove('highlight-player');
            playerOneProfile.classList.add('highlight-player');
        } else {
            playerOneProfile.classList.remove('highlight-player');
            playerTwoProfile.classList.add('highlight-player');
        }
    };

    const displayMessage = (message) => {
        const messageArea = document.querySelector('.game-messages');
        messageArea.textContent = message;
    };

    const getInputtedPlayerOne = () => inputPlayerOne;
    const getInputtedPlayerTwo = () => inputPlayerTwo;

    const grabPlayerProfile = (player) => {
        if (player.isPlayerOne()) {
            return playerOneProfile;
        } else {
            return playerTwoProfile;
        }
    };

    return {
        drawBoard, displayName, displayScore, displaySymbol, displayMessage,
        getInputtedPlayerOne, getInputtedPlayerTwo, highlightPlayer
    };
})();

// game object
// game logic, win logic, game message 
const playGame = (() => {
    let playerOne;
    let playerTwo;
    let currentPlayer;
    let otherPlayer;
    let gameOver = false;
    let gameOutcomeIsWin = false;

    const init = () => {
        const playerOneName = displayController.getInputtedPlayerOne();
        const playerOneSymbol = 'x';
        const playerOnePosition = 1;
        const playerTwoName = displayController.getInputtedPlayerTwo();
        const playerTwoSymbol = 'o';
        const playerTwoPosition = 2;

        playerOne = player(playerOneName, playerOneSymbol, playerOnePosition);
        playerTwo = player(playerTwoName, playerTwoSymbol, playerTwoPosition);

        displayController.displayName(playerOneName, playerOne);
        displayController.displayName(playerTwoName, playerTwo);
        displayController.displaySymbol(playerOneSymbol, playerOne);
        displayController.displaySymbol(playerTwoSymbol, playerTwo);
        displayController.displayScore(playerOne.getScore(), playerOne);
        displayController.displayScore(playerTwo.getScore(), playerTwo);

        currentPlayer = playerOne;
        otherPlayer = playerTwo;
        pickSpot();
    };

    const pickSpot = () => {
        displayController.highlightPlayer(currentPlayer);

        Array.from(gameBoardGrid.children).forEach(spot => {
            if (!(spot.textContent)) {
                spot.addEventListener('click', selectSpot);
                spot.classList.add('hoverOnSpot');
            }
        });

        function selectSpot() {
            gameBoard.setSpot(currentPlayer.getSymbol(), this.getAttribute('data-spot-number'));
            Array.from(gameBoardGrid.children).forEach(spot => {
                spot.removeEventListener('click', selectSpot);
                spot.classList.remove('hoverOnSpot');
            });
            displayController.drawBoard();

            if (checkWin()) {
                gameOutcomeIsWin = true;
                endGame();
            } else if (checkTie()) {
                endGame();
            } else {
                const swapPlayer = currentPlayer;
                currentPlayer = otherPlayer;
                otherPlayer = swapPlayer;
                pickSpot();
            }
        };
    };

    const checkWin = () => {
        const currentBoard = gameBoard.getBoard();
        if ((currentBoard[0] && currentBoard[0] === currentBoard[1] && currentBoard[1] === currentBoard[2]) ||
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
    };

    const endGame = () => {
        gameOver = true;
        if (gameOutcomeIsWin) {
            const currentPlayerScore = currentPlayer.giveWinPoint();
            displayController.displayScore(currentPlayerScore, currentPlayer);
            gameMessage();
        } else {
            gameMessage();
        }
    };

    const gameMessage = () => {
        let messageString = '';

        if (gameOver && gameOutcomeIsWin) {
            messageString = `You win ${currentPlayer.getName()}!`;
        } else {
            messageString = 'The game is a tie!';
        }

        displayController.displayMessage(messageString);
    };

    const getPlayerOne = () => playerOne;
    const getPlayerTwo = () => playerTwo;

    return { init, getPlayerOne, getPlayerTwo };
})();