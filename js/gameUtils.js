'use strict'

// reveal a cell & change game stats
function revealCell(pos, cell) {
    cell.isRevealed = true
    if (!cell.isMine) gGame.revealedCount++

    const elCell = document.querySelector(`[data-pos="${pos.i}-${pos.j}"]`)

    elCell.classList.add('revealed')
    elCell.style.backgroundColor = 'darkgray'
    elCell.innerText = cell.minesAroundCount || ''
}


// When the user clicks a cell with no mines around, reveal not only that cell, but also its neighbors. 
function expandReveal(pos) {
    const neighbors = getNeighboringCells(pos)

    for (let i = 0; i < neighbors.length; i++) {
        const currCellIdx = neighbors[i]
        const currCell = gBoard[currCellIdx.i][currCellIdx.j]
                
        // skip mine/marked/revealed cells
        if (currCell.isMine || currCell.isRevealed || currCell.isMarked) continue
    
        // reveal & render cell, and score
        revealCell(currCellIdx, currCell)
        gElStats.score.innerText = String(gGame.revealedCount).padStart(3, '0')
        
        // check if executing recursion should occur
        if (currCell.minesAroundCount === 0) expandReveal({i : currCellIdx.i, j: currCellIdx.j})
    }
}

// Show all mines upon losing game
function revealMines() {
    for (let i = 0; i < gGame.mineCells.length; i++) {
        const currMine = gGame.mineCells[i]
        const elCell = document.querySelector(`[data-pos="${currMine.i}-${currMine.j}"]`)

        if (elCell.classList.contains('revealed')) continue
        
        elCell.classList.add('revealed')
        elCell.innerText = '💣'
        elCell.style.backgroundColor = 'darkgray' 
    }
}

// display clicked mines to user
function renderClickedMine(pos){
    const elCell = document.querySelector(`[data-pos="${pos.i}-${pos.j}"]`)

    elCell.classList.toggle('revealed')
    elCell.innerText = '💣'
    elCell.style.backgroundColor = 'crimson'

    if (gGame.lives === 0) return
    
    // hide mine if game is not over, and allow user to mark it
    setTimeout( () => {
        elCell.classList.toggle('revealed')
        elCell.innerText = ''
        elCell.style.backgroundColor = 'whitesmoke'
    }, 1000)
}

// Display live Timer values
function renderTimer(startTime, elTimer) {
    const currTime = new Date().getTime();
    const timePassed = currTime - startTime;
    const res = String(Math.floor(timePassed / 1000)).padStart(3, '0');
    
    gGame.secsPassed = +res
    elTimer.innerText = res;
}

// update & render user's current hints count
function updateHintsCount(isNewGame) {
    if (!isNewGame) gGame.hints--

    renderStat('hints', '🌝', '🌚', gElStats.hintsCounter)

    if (gGame.hints === 0) {
        gElStats.hintsCounter.classList.remove('btn')
    }
}

// update & render user's current lives.
function updateLivesCount(isNewGame) {
    if (!isNewGame) {
        gGame.lives--
        // end game if all lives are lost
        if (gGame.lives === 0) checkGameOver(true)
    }

    renderStat('lives', '❤️', '💔', gElStats.livesCounter)
}

// render hints/lives current status
function renderStat(stat, aliveIcon, deadIcon, selector) {
    let str = ''

    for (let i = 0; i < gameMode[stat]; i++) {
        str += (i < gGame[stat]) ? aliveIcon : deadIcon
    }
    selector.innerText = str
}