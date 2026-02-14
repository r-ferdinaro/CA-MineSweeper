'use strict'

// TODO: Support 3 lives and display in UI
// 1. better UI indication on mine click (1 heart lost)
// 2. lives counter decrease from gGame
// 3. Cell is unrevealed after 1 second
// 4. User can mark/click on cell again.

// TODO: Improve UI if user won/lost on game over

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
    firstClick: true,
    mineCells: []
}
let gLevel = {
    size: 4,
    mines: 2
}
const gGameStatus = {
    alive: '🙂',
    lose: '🤯',
    win: '😎'
}

let gBoard = []
let gTimerInterval

const gElStatsContainer = document.querySelector('.stats-container')
const gElStats = {
    score: gElStatsContainer.querySelector('.score'),
    playerStatus: gElStatsContainer.querySelector('.player-status'),
    timer: gElStatsContainer.querySelector('.timer')
}

// Called when page loads 
function onInit() {
    gBoard = []
    gGame = {
        isOn: true,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        firstClick: true,
        mineCells: []
    }
    
    // clear timer and build board
    clearInterval(gTimerInterval)
    buildBoard()

    // render UI on fresh game stats
    gElStats.score.innerText = String(gGame.revealedCount).padStart(3, '0')
    gElStats.timer.innerText = String(gGame.secsPassed).padStart(3, '0')
    gElStats.playerStatus.innerText = gGameStatus.alive
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
        const randomIdx = getRandomInt(0, cells.length)
        const randomCell = cells.splice(randomIdx, 1)[0]
        
        gBoard[randomCell.i][randomCell.j].isMine = true
        gGame.mineCells.push({i: randomCell.i, j: randomCell.j})
    }
}

// count mines around each cell and set the cell's minesAroundCount.
function setMinesNebsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const currCellPos = {i, j}

            //currCell.minesAroundCount = getCellNebsCount(board, currCellPos)
            currCell.minesAroundCount = getCellNebsCount(currCellPos)
        }
    }
}

// count all neighboring bombs of a specific cell
function getCellNebsCount(pos) {
    const cells = getNeighboringCells(pos)
    let res = 0

    for (let i = 0; i < cells.length; i++) {
        const currCellIdx = cells[i]
        const currCell = gBoard[currCellIdx.i][currCellIdx.j]
        
        if(currCell.isMine) res++
    }
    return res
}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    // start game if needed
    if (gGame.firstClick) startGame(i, j)
    
    const currCell = gBoard[i][j]

    // skip already revealed/marked cells and don't play if game is over
    if (currCell.isRevealed || currCell.isMarked || !gGame.isOn) return

    // end game if clicking on a mine
    if (currCell.isMine) {
        // TODO: Should change behavior to trigger only when all lives are lost
        revealMines({i, j})
        checkGameOver(true)
        return
    }

    // reveal and render cell
    revealCell(currCell)
    renderRevealedCell({i, j}, currCell)
    
    // reveal neighboring non-mine cells mines count
    if (currCell.minesAroundCount === 0) expandReveal({i, j})

    // update score upon revealing cell
    gElStats.score.innerText = String(gGame.revealedCount).padStart(3, '0')

    checkGameOver(false)
}

// start game, plant mines (not in first cell), set neighboring mines, and start timer
function startGame(i, j) {
    gGame.isOn = true
    gGame.firstClick = false
    placeMines({i, j})
    setMinesNebsCount(gBoard)

    const startTime = new Date().getTime();

    gTimerInterval = setInterval(renderTimer, 1000, startTime, gElStats.timer);
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
        
        checkGameOver(false)
    } else {
        currCell.isMarked = false
        gGame.markedCount--
        elCell.innerText = ''
    }
}

// When the user clicks a cell with no mines around, reveal not only that cell, but also its neighbors. 
function expandReveal(pos) {
    const neighbors = getNeighboringCells(pos)

    for (let i = 0; i < neighbors.length; i++) {
        const currCellIdx = neighbors[i]
        const currCell = gBoard[currCellIdx.i][currCellIdx.j]
                
        // skip mine/marked/revealed cells
        if (currCell.isMine || currCell.isRevealed || currCell.isMarked) continue
        
        revealCell(currCell)
        renderRevealedCell(currCellIdx, currCell)
        gElStats.score.innerText = String(gGame.revealedCount).padStart(3, '0')
            
        if (currCell.minesAroundCount === 0) expandReveal({i : currCellIdx.i, j: currCellIdx.j})
    }
}

// The game ends when all mines are marked, and all the other cells are revealed
function checkGameOver(isMineClick) {
    let isWon = false

    // TODO: I should change calculation in case mine is clicked if the game is not over (upon supporting 3 lives)
    // If a mine is clicked, the calculation count should decrease by 1
    if (!isMineClick) {
        const allMinesMarked = gGame.markedCount === gLevel.mines
        const allCellsRevealed = gGame.revealedCount === ((gLevel.size ** 2) - gLevel.mines)

        if (!allMinesMarked || !allCellsRevealed) return
        isWon = true        
    }
    
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gElStats.playerStatus.innerText = (isWon) ? gGameStatus.win : gGameStatus.lose
}