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

    const resetGameBoard = () => {
        board.forEach((spot, index) => {board[index] = undefined;});
    };

    return { getBoard, getFilledSpots, getOpenSpots, setSpot, resetGameBoard };
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

    const gameBoardGridSpots = document.querySelectorAll('.game-board-spot');
    const playerOneProfile = document.querySelector('.player-one-profile');
    const playerTwoProfile = document.querySelector('.player-two-profile');
    const startGameForm = document.querySelector('.form-start-game');
    const newGameButton = document.querySelector('.game-controls-new');
    const resetGameButton = document.querySelector('.game-controls-reset');

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
                const gameBoardGridSpot = gameBoardGridSpots[i];
                gameBoardGridSpot.textContent = spot;
            }
        });
    };

    const displayPlayerProfile = (player) => {
        const playerProfile = grabPlayerProfile(player);
        playerProfile.hidden = false;

        displayName(player);
        displaySymbol(player);
        displayScore(player);
    };

    const hidePlayerProfile = (player) => {
        const playerProfile = grabPlayerProfile(player);
        playerProfile.hidden = true;
    }

    const displayName = (player) => {
        const playerProfile = grabPlayerProfile(player);

        const playerProfileName = playerProfile.querySelector('.player-profile-name');
        playerProfileName.textContent = player.getName();
    };

    const displayScore = (player) => {
        const playerProfile = grabPlayerProfile(player);

        const playerProfileScore = playerProfile.querySelector('.player-profile-score');
        playerProfileScore.textContent = `Score: ${player.getScore()}`;
    };

    const displaySymbol = (player) => {
        const playerProfile = grabPlayerProfile(player);

        const playerProfileSymbol = playerProfile.querySelector('.player-profile-symbol');
        playerProfileSymbol.textContent = player.getSymbol();
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

    // reset game 

    newGameButton.addEventListener('click', () => playGame.newGame());
    resetGameButton.addEventListener('click', () => playGame.resetGame());

    const displayNewGameOptions = () => newGameButton.hidden = false;
    const displayResetGameOptions = () => resetGameButton.hidden = false;

    const hideGameOptions = () => {
        newGameButton.hidden = true;
        resetGameButton.hidden = true;
    };

    const resetDisplayBoard = () => {
        gameBoardGridSpots.forEach(gridSpot => {gridSpot.textContent = '';})
    };

    const showStartGameForm = () => {
        startGameForm.hidden = false;
    }

    const hidePlayerProfiles = () => {
        Array.from(playerOneProfile.children)
            .forEach(profileData => profileData.textContent = '');
        Array.from(playerTwoProfile.children)
            .forEach(profileData => profileData.textContent = '');
    }

    return {
        drawBoard, displayName, displayScore, displaySymbol, displayMessage, 
         getInputtedPlayerOne, getInputtedPlayerTwo, highlightPlayer, 
        resetDisplayBoard, displayNewGameOptions, 
        displayResetGameOptions, hideGameOptions, showStartGameForm,
        displayPlayerProfile, hidePlayerProfile
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

        displayController.displayPlayerProfile(playerOne);
        displayController.displayPlayerProfile(playerTwo);

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
            displayController.displayScore(currentPlayer);
            gameMessage();
        } else {
            gameMessage();
        }
        displayController.displayNewGameOptions();
        displayController.displayResetGameOptions();
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

    const newGame = () => {
        gameOver = false;
        gameOutcomeIsWin = false;
        currentPlayer = playerOne;
        otherPlayer = playerTwo;

        gameBoard.resetGameBoard();
        displayController.resetDisplayBoard();
        displayController.displayMessage('');
        displayController.hideGameOptions();
        pickSpot();
    };

    const resetGame = () => {
        gameOver = false;
        gameOutcomeIsWin = false;
        
        gameBoard.resetGameBoard();
        displayController.resetDisplayBoard();
        displayController.displayMessage('');
        displayController.hideGameOptions();
        displayController.hidePlayerProfile(playerOne);
        displayController.hidePlayerProfile(playerTwo);
        displayController.showStartGameForm();
    }

    const getPlayerOne = () => playerOne;
    const getPlayerTwo = () => playerTwo;

    return { init, getPlayerOne, getPlayerTwo, newGame, resetGame};
})();