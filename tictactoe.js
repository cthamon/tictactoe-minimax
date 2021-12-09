size = 3;
const gameBoard = document.querySelector('.game-board');
gameBoard.style.cssText = `display: flex; flex-wrap: wrap; flex-basis: ${(((1 / size * 100) + '% ').repeat(size))}; max-width: ${100 * size}px;`;
const resetButton = document.querySelector('.reset-button');
const announceBox = document.querySelector('.announce-box');
announceBox.style.cssText = `font-size: 80px`;

(() => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.cssText = `border: 1px solid black; width: 98px; height: 98px; display: flex; justify-content: center; align-items: center;`;
            gameBoard.append(tile);
        }
    }
})();

let board = [];
for (let i = 0; i < size * size; i++) { board.push(''); }
const tiles = Array.from(document.querySelectorAll('.tile'));
let isGameActive = true;

const winningConditions = [];
(() => {
    //horizontal wins
    for (let i = 0; i < size; i++) {
        const x = new Array();
        for (let j = 0; j < size; j++) {
            x.push(size * i + j);
        }
        winningConditions.push(x);
    }
    //vertical wins
    for (let i = 0; i < size; i++) {
        const x = new Array();
        for (let j = 0; j < size; j++) {
            x.push(i + size * j);
        }
        winningConditions.push(x);
    }
    //backslash (\) diagonal win
    const backslash = new Array();
    for (let i = 0; i < size; i++) {
        backslash.push((size + 1) * i);
    }
    //slash (/) diagonal win
    const slash = new Array();
    for (let j = 1; j <= size; j++) {
        slash.push((size - 1) * j);
    }
    winningConditions.push(backslash, slash);
    console.log(winningConditions);
})();

function gameResult(board) {
    for (let i = 0; i <= (2 * size) + 1; i++) {
        const winCondition = winningConditions[i];
        const validateWin = new Array();
        winCondition.forEach((indexToWin, index) => {
            if (board[indexToWin] === 'X') {
                validateWin[index] = 'X';
            } else if (board[indexToWin] === 'O') {
                validateWin[index] = 'O';
            } else {
                validateWin[index] = 'invalid';
            }
        });
        if (validateWin.every((el) => el === 'X')) {
            isGameActive = false;
            announceBox.innerText = 'X win';
            return 'X';
        } else if (validateWin.every((el) => el === 'O')) {
            isGameActive = false;
            announceBox.innerText = 'O win';
            return 'O';
        }
    }
    if (!board.includes('') && isGameActive) {
        isGameActive = false;
        announceBox.innerText = 'Tie';
        return null;
    } else {
        return null;
    }
}

function checkAvailableTiles(board) {
    let availableTile = [];
    board.forEach((el, index) => {
        if (el === '') {
            availableTile.push(index);
        }
    });
    return availableTile;
}

// function botMove() { // random
//     let availableTile = checkAvailableTiles(board);
//     let move = availableTile[Math.floor(Math.random() * availableTile.length)];
//     board[move] = 'O';
//     tiles[move].innerText = 'O';
//     gameResult(board);
// }

function botMove() {
    isGameActive = false;
    if (checkAvailableTiles(board).length < 11) {
        const [_, choice] = minimax(board, 'O');
        if (choice != null) {
            board[choice] = 'O';
            tiles[choice].innerText = 'O';
        }
    } else {
        let whereIsX = [];
        board.forEach((el, index) => {
            if (el === 'X') {
                whereIsX.push(index);
            }
        });
        let availableTile = checkAvailableTiles(board);
        let moveAround = [-5, -4, -1, 0, 3, 4];
        if (checkAvailableTiles(board).length > 13 && (whereIsX[0] === 5 || whereIsX[0] === 6 || whereIsX[0] === 9 || whereIsX[0] === 10)) {
            let move = availableTile[whereIsX[0] + moveAround[Math.floor(Math.random() * moveAround.length)]];
            board[move] = 'O';
            tiles[move].innerText = 'O';
        } else {
            let move = availableTile[availableTile[Math.floor(Math.random() * availableTile.length)]];
            board[move] = 'O';
            tiles[move].innerText = 'O';
        }
    }
    isGameActive = true;
    gameResult(board);
}

function minimax(board, player) {
    let scores = { X: -1, O: 1, tie: 0 };
    let winner = gameResult(board);
    announceBox.innerText = '';
    isGameActive = true;
    if (winner !== null) {
        return [scores[winner], null];
    }
    let move, moveScore;
    if (player === 'O') {
        [moveScore, move] = minimaxMaximize(board);
    } else {
        [moveScore, move] = minimaxMinimize(board);
    }

    if (move == null) {
        moveScore = 0;
    }
    return [moveScore, move];
}

function minimaxMaximize(board) {
    let moveScore = -Infinity;
    let move = null;
    let availableTile = checkAvailableTiles(board);
    availableTile.forEach(availableTile => {
        const newBoard = board.map(r => r.slice());
        newBoard[availableTile] = 'O';
        const [newMoveScore, _] = minimax(newBoard, 'X');
        if (newMoveScore > moveScore) {
            move = [availableTile];
            moveScore = newMoveScore;
        }
    });
    return [moveScore, move];
}

function minimaxMinimize(board) {
    let moveScore = Infinity;
    let move = null;
    let availableTile = checkAvailableTiles(board);
    availableTile.forEach(availableTile => {
        const newBoard = board.map(r => r.slice());
        newBoard[availableTile] = 'X';
        const [newMoveScore, _] = minimax(newBoard, 'O');
        if (newMoveScore < moveScore) {
            move = [availableTile];
            moveScore = newMoveScore;
        }
    });
    return [moveScore, move];
}

function reset() {
    board = board.map(el => el = '');
    tiles.forEach(tile => tile.innerText = '');
    announceBox.innerText = '';
    isGameActive = true;
}

const playerAction = (tile, index) => {
    if (isGameActive && board[index] === '') {
        tile.innerText = 'X';
        board[index] = 'X';
        gameResult(board);
        botMove();
    }
};

tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => playerAction(tile, index));
});

resetButton.addEventListener('click', reset);