'use strict'

const gGame = {}
const gLevel = {
    size: 4,
    mines: 2
}
const gBoard = []
let gTimerInterval

// Called when page loads 
function onInit() {
    resetGameStats(false)
    buildBoard()
}

// reset gGame object's stats
function resetGameStats(isOn) {
    const freshStats = {
        isOn: isOn,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    Object.assign(gGame, freshStats)
}

// Builds the board - Set some mines, Call setMinesNebsCount(), Return & render the created board
function buildBoard() {
    const size = gLevel.size

    for (let i = 0; i < size; i++) {
        gBoard.push([])

        for (let j = 0; j < size; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    renderBoard(gBoard)
}

// insert bombs into random cells
function plantMines() {
   const cells = getBoardCells(gBoard)

    for (let i = 0; i < gLevel.mines; i++) {
        const randomCell = cells[getRandomInt(0, cells.length)]
        
        gBoard[randomCell.i][randomCell.j].isMine = true
    }
}

// count mines around each cell and set the cell's minesAroundCount.
function setMinesNebsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const currCellPos = {i: i, j: j}

            currCell.minesAroundCount = getCellNebsCount(board, currCellPos)
        }
    }
}

// count all neighboring bombs of a specific cell
function getCellNebsCount(board, pos) {
    const iLimit = pos.i + 2
    const jLimit = pos.j + 2
    let res = 0

    for (let i = (pos.i - 1); i < iLimit; i++) {
        for (let j = (pos.j - 1); j < jLimit; j++) {
            if (
                (i < 0 || j < 0) || 
                (i === board.length || j === board[i].length) ||
                (i === pos.i && j === pos.j)
            ) continue
            
            const currCell = board[i][j]
            if (currCell.isMine) res++
        }
    }

    return res
}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    // start game if needed
    if (!gGame.isOn) {
        startGame(i, j)
    }

    const currCell = gBoard[i][j]
    // throw a bomb or update score & cell's content
    if (currCell.isMine) {
        // TODO: replace later with functionality to show all mines, and finish the game.
        elCell.innerText = '💣'
    } else {
        //TODO: revealed count should be executed recursively (per game functionality) later per each cell that has been revealed...
        const elScore = document.querySelector('.score')
        
        gGame.revealedCount++
        elScore.innerText = String(gGame.revealedCount).padStart(3, '0')
        elCell.innerText = currCell.minesAroundCount
    }
}

// start game, plant mines (not in first cell), set neighboring mines, and start timer
function startGame(i, j) {
    gGame.isOn = true
    gBoard[i][j].isRevealed = true
    plantMines()
    setMinesNebsCount(gBoard)

    const elTimer = document.querySelector('.timer');
    const startTime = new Date().getTime();

    gTimerInterval = setInterval(renderTimer, 1000, startTime, elTimer);
}

// Called when a cell is rightclicked - See how you can hide the context menu on right click
function onCellMarked(elCell, i, j) {

}

// The game ends when all mines are marked, and all the other cells are revealed
function checkGameOver() {

}

// When the user clicks a cell with no mines around, reveal not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only reveals the non-mine 1st degree neighbors.
// BONUS: Do it like the real algorithm (see description at the Bonuses section below)
function expandReveal(board, elCell, i, j) {

}