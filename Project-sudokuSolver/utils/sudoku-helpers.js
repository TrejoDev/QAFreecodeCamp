function stringToGrid(puzzleString) {
  let grid = [];
  for (let i = 0; i < 9; i++) {
    grid.push(puzzleString.slice(i * 9, (i + 1) * 9).split(''));
  }
  return grid;
}

function gridToString(grid) {
  return grid.map(row => row.join('')).join('');
}

function findEmptyCell(grid) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === '.') {
        return [i, j];
      }
    }
  }
  return null;
}

function isValidRow(grid, row, value) {
  return !grid[row].includes(value);
}

function isValidCol(grid, col, value) {
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === value) {
      return false;
    }
  }
  return true;
}

function isValidRegion(grid, startRow, startCol, value) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === value) {
        return false;
      }
    }
  }
  return true;
}

function solveHelper(grid) {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) {
    return true;
  }

  const [row, col] = emptyCell;

  for (let num = 1; num <= 9; num++) {
    const value = num.toString();
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    if (
      isValidRow(grid, row, value) &&
      isValidCol(grid, col, value) &&
      isValidRegion(grid, startRow, startCol, value)
    ) {
      grid[row][col] = value;

      if (solveHelper(grid)) {
        return true;
      }

      grid[row][col] = '.';
    }
  }

  return false;
}

module.exports = {
  stringToGrid,
  gridToString,
  findEmptyCell,
  solveHelper
};