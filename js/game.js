'use strict'

const gGame = {}
const gLevel = {
    size: 4,
    mines: 2
}
const gBoard = []

// Called when page loads 
function onInit() {
    resetGameStats()
    buildBoard()
    renderBoard(gBoard)
}

// reset gGame object's stats
function resetGameStats() {
    const freshStats = {
        isOn: false,
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

    plantMines()
    setMinesNebsCount(gBoard)
}

function plantMines() {
    gBoard[1][1].isMine = true
    gBoard[2][2].isMine = true
// Actual working function - will replace utilize later 
    //    const cells = getBoardCells(gBoard)
//
//    for (let i = 0; i < gLevel.mines; i++) {
//        const randomCell = cells[getRandomInt(0, cells.length)]
//        
//        gBoard[randomCell.i][randomCell.j].isMine = true
//    }
}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNebsCount(board) {

}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {

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