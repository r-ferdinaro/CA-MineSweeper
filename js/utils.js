'use strict'

// Render the board as a <table> to the page
function renderBoard(board) {
    let strHTML = ''

    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            
            strHTML += `<td data-pos="${i}-${j}" class="cell" onclick="onCellClicked(${i}, ${j})" oncontextmenu="onCellMarked(this, event, ${i}, ${j})"></td>`
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

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}