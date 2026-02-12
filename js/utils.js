'use strict'

// Render the board as a <table> to the page
function renderBoard(board) {
    let strHTML = '<table><tbody>'

    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            
            // TODO: remove displaying neighboring bombs by default!!
            strHTML += `<td class="cell" onclick="onCellClicked(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</table></tbody>'

    const elTable = document.querySelector('.table-container')
    elTable.innerHTML = strHTML
}

// get all board's cell positions inside array
function getBoardCells(board) {
    const res = []

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].isRevealed !== true) res.push({i, j})
        }
    }
    
    return res
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