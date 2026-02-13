'use strict'

let gGame = {
    isOn: true,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true
}
let gLevel = {
    size: 4,
    mines: 2
}
const gBoard = []
let gTimerInterval

// Called when page loads 
function onInit() {
    gGame = {
    isOn: true,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true
    }

    buildBoard()
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

// insert bombs into random cells (skip first cell)
function placeMines(firstCell) {
   const cells = getBoardCells(gBoard, firstCell)

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

// TODO: make loops more readable and don't use +2 for limits
// count all neighboring bombs of a specific cell
function getCellNebsCount(board, pos) {
    const iStart = pos.i - 1
    const jStart = pos.j - 1
    const iEnd = pos.i + 1
    const jEnd = pos.j + 1

    let res = 0

    for (let i = iStart; i <= iEnd; i++) {
        for (let j = jStart; j <= jEnd; j++) {
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
    if (gGame.firstClick) startGame(i, j)
    
    // skip already revealed cells
    if (gBoard[i][j].isRevealed) return

    const currCell = gBoard[i][j]
    // throw a bomb or update score & cell's content
    if (currCell.isMine) {
        // TODO: replace later with functionality to show all mines, and finish the game.
        elCell.innerText = '💣'
    } else {
        //TODO: revealed count should be executed recursively (per game functionality) later per each cell that has been revealed...
        gBoard[i][j].isRevealed = true
        gGame.revealedCount++

        const elScore = document.querySelector('.score')

        elScore.innerText = String(gGame.revealedCount).padStart(3, '0')
        elCell.innerText = currCell.minesAroundCount

        checkGameOver()
    }
}

// start game, plant mines (not in first cell), set neighboring mines, and start timer
function startGame(i, j) {
    gGame.isOn = true
    gGame.firstClick = false
    placeMines({i, j})
    setMinesNebsCount(gBoard)

    const elTimer = document.querySelector('.timer');
    const startTime = new Date().getTime();

    gTimerInterval = setInterval(renderTimer, 1000, startTime, elTimer);
}

// Called when a cell is rightclicked - See how you can hide the context menu on right click
// TODO: hide contextmenu on rightclick and detect right click for marking. - oncontextmenu="" functionality
// TODO: add .preventDefault() to stop opening the context menu
// TODO: if a cell has been revealed it cannot be un/marked
// TODO: update cell is marked/unmarked and add/decreese gGame.markedCount value
function onCellMarked(elCell, i, j) {

}

// The game ends when all mines are marked, and all the other cells are revealed
function checkGameOver() {
    if (gGame.markedCount === gLevel.mines && gGame.revealedCount === ((gLevel.size ** 2) - gLevel.mines)) {
        clearInterval(gTimerInterval)
        gGame.isOn = false
    }
}

// When the user clicks a cell with no mines around, reveal not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only reveals the non-mine 1st degree neighbors.
// BONUS: Do it like the real algorithm (see description at the Bonuses section below)
function expandReveal(board, elCell, i, j) {

}