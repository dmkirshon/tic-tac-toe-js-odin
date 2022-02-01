/**
 *  Project: Tic Tac Toe
 *  Author: David Kirshon
 */

// gameboard object
// create gameboard, open spots, valid placement

const gameBoard = (() => {
    const board = [...Array(9)];

    const getBoard = () => board;

    const setSpot = (symbol, location) => { board[location] = symbol; };

    const isThreeInARow = () => {
        if ((board[0] && board[0] === board[1] && board[1] === board[2]) ||
            (board[0] && board[0] === board[3] && board[3] === board[6]) ||
            (board[0] && board[0] === board[4] && board[4] === board[8]) ||
            (board[1] && board[1] === board[4] && board[4] === board[7]) ||
            (board[2] && board[2] === board[4] && board[4] === board[6]) ||
            (board[2] && board[2] === board[5] && board[5] === board[8]) ||
            (board[3] && board[3] === board[4] && board[4] === board[5]) ||
            (board[6] && board[6] === board[7] && board[7] === board[8])) {
            return true;
        } else {
            return false;
        }
    };

    const isSpotEmpty = (spot) => spot ? false : true;
    const isBoardFilled = () => !(board.includes(undefined));


    const resetGameBoard = () => {
        board.forEach((spot, index) => { board[index] = undefined; });
    };

    return { getBoard, setSpot, resetGameBoard, isThreeInARow, isBoardFilled, isSpotEmpty};
})();

// player objects
// names, x or o, scores, position
const player = (name, symbol, position) => {
    let score = 0;

    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;

    const giveWinPoint = () => ++score;

    const isPlayerOne = (player) => position === 1 ? true : false;
    const isPlayerTwo = (player) => position === 2 ? true : false;


    return {
        getName, getScore, getSymbol,
        giveWinPoint, isPlayerOne, isPlayerTwo
    };
};

// computer object: type of player

const computer = (symbol, position, mode) => {
    const isComputer = true;
    const prototype = player('Computer', symbol, position);

    const computerMove = () => {
        let chooseMove;
        const availableMoves = [];

        if(mode === 'easy'){
            gameBoard.getBoard().forEach((spot, index) => {
                if(gameBoard.isSpotEmpty(spot)) {
                    availableMoves.push(index);
                }
            });
        chooseMove = Math.floor(Math.random() * availableMoves.length);
        }

        return availableMoves[chooseMove];
    };

    return Object.assign({}, prototype, {isComputer, computerMove});
    
}

// display object

const displayController = (() => {
    let inputPlayerOne;
    let inputPlayerTwo;
    let selectedOpponent;

    const gameBoardGridSpots = document.querySelectorAll('.game-board-spot');
    const playerOneProfile = document.querySelector('.player-one-profile');
    const playerTwoProfile = document.querySelector('.player-two-profile');
    const startGameForm = document.querySelector('.form-start-game');
    const newGameButton = document.querySelector('.game-controls-new');
    const resetGameButton = document.querySelector('.game-controls-reset');
    const opponentRadioButton = document.querySelectorAll('input[name="chooseOpponent"]');

    opponentRadioButton.forEach(choice => {
        choice.addEventListener('click', changePlayerTwo)
    });

    function changePlayerTwo() {
        if(this.value === 'computer') {
            document.getElementById('playerTwo').disabled = true;
        } else {
            document.getElementById('playerTwo').disabled = false;
        }
    };

    startGameForm.addEventListener('submit', (event) => {
        event.preventDefault();

        inputPlayerOne = document.getElementById('playerOne').value;

        opponentRadioButton.forEach(choice => {
            if(choice.checked) {
                selectedOpponent = choice.value;
            }
        });

        if (!isSelectedOpponentComputer()) {
            inputPlayerTwo = document.getElementById('playerTwo').value;
        } else {
            inputPlayerTwo = selectedOpponent;
        }

        startGameForm.reset();
        document.getElementById('playerTwo').disabled = false;
        startGameForm.hidden = true;
        playGame.init();
    });

    const getInputtedPlayerOne = () => inputPlayerOne;
    const getInputtedPlayerTwo = () => inputPlayerTwo;
    const isSelectedOpponentComputer = () => selectedOpponent === 'computer' ? true : false;

    const updateBoard = () => {
        gameBoard.getBoard().forEach((spot, i) => {
            if (spot) {
                const gameBoardGridSpot = gameBoardGridSpots[i];
                gameBoardGridSpot.textContent = spot;
            }
        });
    };

    const activateBoard = () => {
        gameBoardGridSpots.forEach(spot => {
            if (!(spot.textContent)) {
                spot.addEventListener('click', selectSpot);
                spot.classList.add('hoverOnSpot');
            }
        });
    };

    function selectSpot() {
        const currentPlayer = playGame.getCurrentPlayer();

        gameBoard.setSpot(currentPlayer.getSymbol(), this.getAttribute('data-spot-number'));
        updateBoard();

        gameBoardGridSpots.forEach(spot => {
            spot.removeEventListener('click', selectSpot);
            spot.classList.remove('hoverOnSpot');
        });
        playGame.checkRound();
    };

    const displayPlayerProfile = (player) => {
        const playerProfile = grabPlayerProfile(player);
        playerProfile.hidden = false;

        const playerProfileName = playerProfile.querySelector('.player-profile-name');
        const playerProfileScore = playerProfile.querySelector('.player-profile-score');
        const playerProfileSymbol = playerProfile.querySelector('.player-profile-symbol');

        playerProfileName.textContent = player.getName();
        playerProfileScore.textContent = `Score: ${player.getScore()}`;
        playerProfileSymbol.textContent = player.getSymbol();
    };

    const hidePlayerProfile = (player) => {
        const playerProfile = grabPlayerProfile(player);
        playerProfile.hidden = true;
    };

    const updateScore = (player) => {
        const playerProfile = grabPlayerProfile(player);

        const playerProfileScore = playerProfile.querySelector('.player-profile-score');
        playerProfileScore.textContent = `Score: ${player.getScore()}`;
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

    const displayGameOptions = () => {
        newGameButton.hidden = false;
        resetGameButton.hidden = false;
    };

    const hideGameOptions = () => {
        newGameButton.hidden = true;
        resetGameButton.hidden = true;
    };

    const resetDisplayBoard = () => {
        gameBoardGridSpots.forEach(gridSpot => { gridSpot.textContent = ''; });
    };

    const showStartGameForm = () => {
        startGameForm.hidden = false;
    };

    const hidePlayerProfiles = () => {
        Array.from(playerOneProfile.children)
            .forEach(profileData => profileData.textContent = '');
        Array.from(playerTwoProfile.children)
            .forEach(profileData => profileData.textContent = '');
    };

    return {
        updateScore, displayMessage, activateBoard, updateBoard,
        getInputtedPlayerOne, getInputtedPlayerTwo, isSelectedOpponentComputer,
        highlightPlayer, resetDisplayBoard, showStartGameForm,
        displayGameOptions, hideGameOptions, 
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

        if(displayController.isSelectedOpponentComputer()) {
            playerTwo = computer(playerTwoSymbol, playerTwoPosition, 'easy');
        } else {
            playerTwo = player(playerTwoName, playerTwoSymbol, playerTwoPosition);
        }

        displayController.displayPlayerProfile(playerOne);
        displayController.displayPlayerProfile(playerTwo);

        currentPlayer = playerOne;
        otherPlayer = playerTwo;
        playTurn();
    };

    const playTurn = () => {
        displayController.highlightPlayer(currentPlayer);

        if(currentPlayer.isComputer) {
            gameBoard.setSpot(currentPlayer.getSymbol(), currentPlayer.computerMove());
            displayController.updateBoard();
            checkRound();
        } else {
            displayController.activateBoard(); 
        }
    };

    const checkRound = () => {
        if (checkWin()) {
            gameOutcomeIsWin = true;
            endGame();
        } else if (checkTie()) {
            endGame();
        } else {
            const swapPlayer = currentPlayer;
            currentPlayer = otherPlayer;
            otherPlayer = swapPlayer;
            playTurn();
        }
    };

    const checkWin = () => {
        if (gameBoard.isThreeInARow()) {
            return true;
        } else {
            return false;
        }
    };

    const checkTie = () => {
        if (gameBoard.isBoardFilled()) {
            return true;
        } else {
            return false;
        }
    };

    const endGame = () => {
        gameOver = true;
        if (gameOutcomeIsWin) {
            const currentPlayerScore = currentPlayer.giveWinPoint();
            displayController.updateScore(currentPlayer);
            gameMessage();
        } else {
            gameMessage();
        }
        displayController.displayGameOptions();
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
        playTurn();
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
    };

    const getCurrentPlayer = () => currentPlayer;

    return { init, getCurrentPlayer, checkRound, newGame, resetGame };
})();