'use strict'

// BONUS
// 1. Best score - store values per 6 best (players?) per level in local storage
// 2. Safe Click button (3 times) - highlight an unrevealed random non-mine cell for 1.5 seconds
// 3. Undo button - he user can undo (some of) his moves ??
// 4. Manually positioned mines mode = Allow user to position the mines (per count of mines) in a new game then start it
// 5. MINE EXTERMINATOR button - will exterminate 3 random mines from game (remove from gBoard, decrease mine count, calculate neighbors, render revealed cells)

const gModes = {
    easy: {size: 4, mines: 2, lives: 1, hints: 3},
    medium: {size: 8, mines: 14, lives: 2, hints: 3},
    expert: {size: 12, mines: 32, lives: 3, hints: 3}
}
let gameMode
let gLevel = {
    size: 4,
    mines: 2
}
let gGame = {
    isOn: true,
    lives: 0,
    hints: 3,
    hintMode: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true,
    mineCells: []
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
    timer: gElStatsContainer.querySelector('.timer'),
    hintsCounter: gElStatsContainer.querySelector('.hints-count'),
    livesCounter: gElStatsContainer.querySelector('.lives-count'),
}

// Called when page loads 
function onInit(mode) {
    // reset all stats
    gameMode = (mode) ? gModes[mode] : gameMode
    gLevel = {
        size: gameMode.size,
        mines: gameMode.mines
    }
    gGame = {
        isOn: true,
        lives: gameMode.lives,
        hints: 3,
        hintMode: false,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        firstClick: true,
        mineCells: []
    }
    gBoard = []
    updateLivesCount(true)
    updateHintsCount(true)

    // clear timer, lives, and build board
    clearInterval(gTimerInterval)
    buildBoard()

    // render UI on fresh game stats
    gElStats.score.innerText = String(gGame.revealedCount).padStart(3, '0')
    gElStats.timer.innerText = String(gGame.secsPassed).padStart(3, '0')
    gElStats.playerStatus.innerText = gGameStatus.alive
    gElStats.hintsCounter.classList.add('btn')
    gElStats.hintsCounter.classList.remove('hint-mode')
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

// Called when a cell is clicked
function onCellClicked(i, j) {
    // start game if needed
    if (gGame.firstClick) startGame(i, j)
    
    const currCell = gBoard[i][j]

    // skip already revealed/marked cells and don't play if game is over
    if (currCell.isRevealed || currCell.isMarked || !gGame.isOn) return

    // use hint
    if (gGame.hintMode) {
        updateHintsCount(false)
        hintReveal({i, j})
        return
    }

    // reduce lives upon clicking on a mine
    if (currCell.isMine) {
        updateLivesCount(false)
        renderClickedMine({i, j})
        return
    }

    // reveal and render cell
    revealCell({i, j}, currCell)
    
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

// insert mines into random cells (skip first cell)
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

// count all neighboring mines of a specific cell
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

// change hint mode upon clicking on hint button in stats bar
function onHintClick() {
    if (gGame.hints === 0 || gGame.firstClick || !gGame.isOn) return
    
    gGame.hintMode = !gGame.hintMode
    gElStats.hintsCounter.classList.add('hint-mode')
}

// upon spending hint - temporarily reveal selected cell & close-rang neighbors
function hintReveal(pos) {
    const positions = [pos, ...getNeighboringCells(pos)]
    const cellsToRestore = []

    for (let i = 0; i < positions.length; i++) {
        const currPos = positions[i]
        const currCell = gBoard[currPos.i][currPos.j]

        // skip already revealed cells to avoid hiding them afterwards
        if (currCell.isRevealed) continue

        const elCell = document.querySelector(
            `[data-pos="${currPos.i}-${currPos.j}"]`
        )

        elCell.classList.add('revealed')
        elCell.style.backgroundColor = 'darkgray'

        if (currCell.isMine) {
            elCell.innerText = '💣'
        } else {
            elCell.innerText = currCell.minesAroundCount || ''
        }

        cellsToRestore.push(elCell)
    }

    // revet changes and un-reveal cells
    setTimeout(() => {
        for (let i = 0; i < cellsToRestore.length; i++) {
            const elCell = cellsToRestore[i]

            elCell.classList.remove('revealed')
            elCell.style.backgroundColor = ''
            elCell.innerText = ''
        }
    }, 1500)

    gGame.hintMode = false
    gElStats.hintsCounter.classList.remove('hint-mode')
}

// user can mark potential mines
function onCellMarked(elCell, ev, i, j) {
    const currCell = gBoard[i][j]
    
    ev.preventDefault(); 
    
    // can't mark revealed cells or mark any cell if game is over
    if (currCell.isRevealed || !gGame.isOn) return
    
    // render if cell is marked in UI
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
    elCell.classList.toggle('revealed')
}

// The game ends when all mines are marked, and all the other cells are revealed
function checkGameOver(isMineClick) {
    let isWon = false

    // check if user finished game
    if (!isMineClick) {
        // check if user marked all remaining mines and clicked on all of the non-mine cells
        const areAllMinesMarked = (gGame.markedCount === gLevel.mines)
        const areAllCellsRevealed = (gGame.revealedCount === ((gLevel.size ** 2) - gLevel.mines))

        // return if user has not marked mines and clicked on all cells
        if (!areAllMinesMarked || !areAllCellsRevealed) return
        isWon = true        
    }
    
    // finish game
    clearInterval(gTimerInterval)
    if (!isWon) revealMines()
    gGame.isOn = false
    gElStats.playerStatus.innerText = (isWon) ? gGameStatus.win : gGameStatus.lose
}