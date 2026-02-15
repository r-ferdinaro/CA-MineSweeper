'use strict'

// Render the board as a <table> to the page
function renderBoard(board) {
    let strHTML = ''

    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            
            strHTML += `<td data-i="" data-pos="${i}-${j}" class="cell" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, event, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }

    const elTable = document.querySelector('tbody')
    elTable.innerHTML = strHTML
}

// get all board's cell positions inside array (skip first clicked cell)
function getBoardCells(board, firstCell) {
    const res = []

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            // TODO: ensure first clicked cell is not in res
            if (i === firstCell.i && j === firstCell.j) continue
            res.push({i, j})
        }
    }
    return res
}

// provide a cell and return all of its valid neighboring cells
function getNeighboringCells(pos){
    const iStart = pos.i - 1
    const jStart = pos.j - 1
    const iEnd = pos.i + 1
    const jEnd = pos.j + 1

    const res = []

    for (let i = iStart; i <= iEnd; i++) {
        for (let j = jStart; j <= jEnd; j++) {
            if (
                (i < 0 || j < 0) || 
                (i === gBoard.length || j === gBoard[i].length) ||
                (i === pos.i && j === pos.j)
            ) continue
            
            res.push({i, j})
        }
    }
    return res
}

// reveal a cell & change game stats
function revealCell(cell) {
    cell.isRevealed = true

    if (cell.isMarked) {
        cell.isMarked = false
        gGame.markedCount--
    }

    if (!cell.isMine) gGame.revealedCount++
}

// render revealed cell in UI
function renderRevealedCell(pos, cell) {
    const elCell = document.querySelector(`[data-pos="${pos.i}-${pos.j}"]`)

    elCell.classList.add('revealed')
    elCell.style.backgroundColor = 'darkgray'
    elCell.innerText = cell.minesAroundCount || ''
}

// TODO: Should change behavior to trigger only when all lives are lost
// Show all mines upon losing game
function revealMines(clickedMine) {
    for (let i = 0; i < gGame.mineCells.length; i++) {
        const currMine = gGame.mineCells[i]
        const isClickedMine = currMine.i === clickedMine.i && currMine.j === clickedMine.j
        const elCell = document.querySelector(`[data-pos="${currMine.i}-${currMine.j}"]`)
        
        elCell.classList.add('revealed')
        elCell.innerText = '💣'
        elCell.style.backgroundColor = (isClickedMine) ? 'crimson' : 'darkgray' 
    }
}

// Display live Timer values
function renderTimer(startTime, elTimer) {
    const currTime = new Date().getTime();
    const timePassed = currTime - startTime;
    const res = String(Math.floor(timePassed / 1000)).padStart(3, '0');
    
    gGame.secsPassed = +res
    elTimer.innerText = res;
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}