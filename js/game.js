'use strict'

const gBoard = []

// Called when page loads 
function onInit() {

}

// Builds the board - Set some mines, Call setMinesNegsCount(), Return & render the created board
function buildBoard() {
    
}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {

}

// Render the board as a <table> to the page
function renderBoard(board) {

}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {

}

// Called when a cell is rightclicked - See how you can hide the context menu on right click
function onCellMarked(elCell, i, j) {

}

// The game ends when all mines are marked, and all the other cells are revealed
function checkGameOver() {

}

// When the user clicks a cell with no mines around, reveal not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only reveals the non-mine 1st degree neighbors.
// BONUS: Do it like the real algorithm (see description at the Bonuses section below)
function expandReveal(board, elCell, i, j) {

}