const {
  stringToGrid,
  gridToString,
  findEmptyCell,
  solveHelper
} = require('../utils/sudoku-helpers');

class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    const end = start + 9;
    for (let i = start; i < end; i++) {
      if (i !== start + column && puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + column;
      if (i !== row && puzzleString[index] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        const index = i * 9 + j;
        if ((i !== row || j !== column) && puzzleString[index] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return false;
    }

    const grid = stringToGrid(puzzleString);

    if (solveHelper(grid)) {
      return gridToString(grid);
    } else {
      return false;
    }
  }
}

module.exports = SudokuSolver;