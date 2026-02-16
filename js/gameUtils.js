// reveal a cell & change game stats
function revealCell(pos, cell) {
    cell.isRevealed = true
    if (!cell.isMine) gGame.revealedCount++

    const elCell = document.querySelector(`[data-pos="${pos.i}-${pos.j}"]`)

    elCell.classList.add('revealed')
    elCell.style.backgroundColor = 'darkgray'
    elCell.innerText = cell.minesAroundCount || ''

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