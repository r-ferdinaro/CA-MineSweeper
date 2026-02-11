'use strict'

// Render the board as a <table> to the page
function renderBoard(board) {
    let strHTML = '<table><tbody>'

    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            
            strHTML += `<td class="cell"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</table></tbody>'

    const elTable = document.querySelector('.table-container')
    elTable.innerHTML = strHTML
}

function getBoardCells(board) {
    const res = []

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            res.push({i, j})
        }
    }
    
    return res
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}