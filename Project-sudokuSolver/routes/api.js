'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body; 
      
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      } 

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      } 

      if (!/^[1-9.]+$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      } 

      const coordinateRegex = /^[A-I][1-9]$/;
      // console.log(coordinate);
      
      if (!coordinateRegex.test(coordinate.toUpperCase())) {
        return res.json({ error: 'Invalid coordinate' });
      } 

      const row = coordinate.toUpperCase().charCodeAt(0) - 65; 

      const column = parseInt(coordinate[1]) - 1; // 1=0, 2=1, ...  

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      } 

      // Aquí llamaremos a las funciones del solver para verificar la ubicación
      const rowCheck = solver.checkRowPlacement(puzzle, row, column, value);
      const colCheck = solver.checkColPlacement(puzzle, row, column, value);
      const regionCheck = solver.checkRegionPlacement(puzzle, row, column, value);  

      const isValid = rowCheck && colCheck && regionCheck;  

      if (isValid) {
        return res.json({ valid: true });
      } else {
        let conflicts = [];
        if (!rowCheck) conflicts.push('row');
        if (!colCheck) conflicts.push('column');
        if (!regionCheck) conflicts.push('region');
        return res.json({ valid: false, conflict: conflicts });
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (!/^[1-9.]+$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      const solution = solver.solve(puzzle);

      if (solution) {
        return res.json({ solution: solution });
      } else {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
    });
};
