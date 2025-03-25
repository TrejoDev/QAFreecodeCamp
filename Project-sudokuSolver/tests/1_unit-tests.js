const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');


suite('Unit Tests', () => {

    const solver = new Solver();

    suite('Function validate(puzzleString)', () => {
        test('Logic handles a valid puzzle string of 81 characters', (done) => {
        
            const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            assert.isTrue(solver.validate(validPuzzle), 'Valid puzzle string should return true');
            done();
        });

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
             const invalidCharsPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.X';
             assert.isFalse(solver.validate(invalidCharsPuzzle), 'Puzzle string with invalid characters should return false');
             done();
            });
        

        test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
            const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'; // 80 characters
            assert.isFalse(solver.validate(shortPuzzle), 'Puzzle string of incorrect length should return false');

            const longPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.123'; // 83 characters
            assert.isFalse(solver.validate(longPuzzle), 'Puzzle string of incorrect length should return false');
            done();
        });
    });

    suite('Function checkRowPlacement(puzzleString, row, column, value)', () => {
        test('Logic handles a valid row placement', (done) => {
            const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const row = 0;
            const column = 1;
            const value = '2'; // El número 1 no existe en la primera fila

            assert.isTrue(solver.checkRowPlacement(puzzle, row, column, value), 'Should return true for valid row placement');
            done();
        });

        test('Logic handles an invalid row placement', (done) => {
          const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
          const row = 0;
          const column = 0;
          const value = '9'; // El número 9 ya existe en la primera fila
          assert.isFalse(solver.checkRowPlacement(puzzle, row, column, value), 'Should return false for invalid row placement');
          done();
        });
    });
    
    suite('Function checkColPlacement(puzzleString, row, column, value)', () => {
        test('Logic handles a valid column placement', (done) => {
          const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
          const row = 1;
          const column = 0;
          const value = '2'; // El número 2 no existe en la primera columna
          assert.isTrue(solver.checkColPlacement(puzzle, row, column, value), 'Should return true for valid column placement');
          done();
        });

        test('Logic handles a valid column placement', (done) => {
          const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
          const row = 1;
          const column = 0;
          const value = '7'; // El número 7 no existe en la primera columna
          assert.isTrue(solver.checkColPlacement(puzzle, row, column, value), 'Should return true for valid column placement');
          done();
        });

        
    });

    suite('Function checkRegionPlacement(puzzleString, row, column, value)', () => {

        test('Logic handles a valid region placement', (done) => {
          const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
          const row = 0;
          const column = 0;
          const value = '1'; // El número 1 no existe en la región superior izquierda
          assert.isTrue(solver.checkRegionPlacement(puzzle, row, column, value), 'Should return true for valid region placement');
          done();
        });

        test('Logic handles an invalid region placement', (done) => {
          const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
          const row = 0;
          const column = 0;
          const value = '9'; 
          assert.isFalse(solver.checkRegionPlacement(puzzle, row, column, value), 'Should return false for invalid region placement');
          done();
        });

    });

    suite('Function solve(puzzleString)', () => {

        test('Valid puzzle strings pass the solver', (done) => {
          puzzlesAndSolutions.slice(0, 5).forEach(puzzle => { // Tomamos los primeros 5 puzzles como ejemplo
            assert.isNotFalse(solver.solve(puzzle[0]), 'Solver should not return false for a valid puzzle');
          });
          done();
        });

        test('Invalid puzzle strings fail the solver', (done) => {
          const invalidPuzzle1 = 'A.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'; // Contiene 'A'
          assert.isFalse(solver.solve(invalidPuzzle1), 'Solver should return false for a puzzle with invalid characters');

          const invalidPuzzle2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'; // 80 caracteres
          assert.isFalse(solver.solve(invalidPuzzle2), 'Solver should return false for a puzzle of incorrect length');
          done();
        });

        test('Solver returns the expected solution for an incomplete puzzle', (done) => {
          const puzzle = puzzlesAndSolutions[0][0]; // Tomamos el primer puzzle incompleto
          const expectedSolution = puzzlesAndSolutions[0][1]; // Y su solución esperada
          assert.equal(solver.solve(puzzle), expectedSolution, 'Solver should return the expected solution');
          done();
        });

    });

});
