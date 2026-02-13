'use strict'

// TODO: Support 3 lives and display in UI
// 1. better UI indication on mine click (1 heart lost)
// 2. lives counter decrease from gGame
// 3. Cell is unrevealed after 1 second
// 4. User can mark/click on cell again.

// TODO: show user if they won/lost on game over

// TODO: Add smiley button (for restart) and show it's status - 🙂 (has lives), 😵 (no lives/lost), 🤩 (user won)
// TODO: Support restarting game and render UI button upon game over (smiley button)

// TODO: Support levels - easy (4*4 & 2), Medium (8*8 & 14), Expert (12 * 12 & 32)

// BONUS
// 1. 3 hints - user can select a cell and have it and its neighbors unrevealed for 1.5 seconds
// 2. Best score - store values per 6 best (players?) per level in local storage
// 3. Full expand - If a cell with 0 mines is clicked, reveal it's neighbors, recursive operation for neighbors
// 4. Safe Click button (3 times) - highlight an unrevealed random non-mine cell for 1.5 seconds
// 5. Undo button - he user can undo (some of) his moves ??
// 6. Manually positioned mines mode = Allow user to position the mines (per count of mines) in a new game then start it
// 7. MINE EXTERMINATOR button - will exterminate 3 random mines from game (remove from gBoard, decrease mine count, calculate neighbors, render revealed cells)

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
    
    const currCell = gBoard[i][j]

    // skip already revealed cells
    if (currCell.isRevealed || !gGame.isOn) return
    currCell.isRevealed = true
    
    if (currCell.isMarked) {
        currCell.isMarked = false
        gGame.markedCount--
    } 

    // throw a bomb or update score & cell's content
    if (currCell.isMine) {
        // TODO: replace later with functionality to show all mines, and finish the game.
        checkGameOver(false)
        elCell.innerText = '💣'
    } else {
        //TODO: revealed count should be executed recursively (per game functionality) later per each cell that has been revealed...
        gGame.revealedCount++

        const elScore = document.querySelector('.score')

        elScore.innerText = String(gGame.revealedCount).padStart(3, '0')
        //elCell.innerText = currCell.minesAroundCount
        elCell.innerText = (currCell.minesAroundCount !== 0) ? currCell.minesAroundCount : ''
        elCell.style.backgroundColor = 'darkgray'

        checkGameOver(true)
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
// TODO: add/decreese gGame.markedCount value
function onCellMarked(elCell, ev, i, j) {
    const currCell = gBoard[i][j]
    
    ev.preventDefault(); 
    
    if (currCell.isRevealed || !gGame.isOn) return
    if (!currCell.isMarked) {
        currCell.isMarked = true
        gGame.markedCount++
        elCell.innerText = '🚩'
        
        checkGameOver(true)
    } else {
        currCell.isMarked = false
        gGame.markedCount--
        elCell.innerText = ''
    }
}

// The game ends when all mines are marked, and all the other cells are revealed
function checkGameOver(isCellClick) {
    let isWon

    // TODO: I should change calculation in case mine is clicked if the game is not over (upon supporting 3 lives)
    // If a mine is clicked, the calculation count should decrease by 1
    if (isCellClick) {
        const allMinesMarked = gGame.markedCount === gLevel.mines
        const allCellsRevealed = gGame.revealedCount === ((gLevel.size ** 2) - gLevel.mines)

        if (!allMinesMarked || !allCellsRevealed) return
        isWon = true        
    } else {
        isWon = false
    }
    
    clearInterval(gTimerInterval)
    gGame.isOn = false
}

// When the user clicks a cell with no mines around, reveal not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only reveals the non-mine 1st degree neighbors.
// BONUS: Do it like the real algorithm (see description at the Bonuses section below)
function expandReveal(board, elCell, i, j) {

}