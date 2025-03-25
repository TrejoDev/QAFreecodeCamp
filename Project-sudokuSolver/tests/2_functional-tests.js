const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('POST /api/check', () => {
        test('Check a puzzle placement with all fields', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A2',
                value: '6'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'valid', 'response should contain valid property');
                assert.isBoolean(res.body.valid, 'valid property should be a boolean');
                assert.isTrue(res.body.valid, 'Placement should be valid');
                done();
            });
        });

        test('Check a puzzle placement with single placement conflict', (done) => {
          chai.request(server)
            .post('/api/check')
            .send({
              puzzle: puzzlesAndSolutions[0][0],
              coordinate: 'A2', // La celda A2 está vacía ('.')
              value: '4' 
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'valid', 'response should contain valid property');
              console.log({body: res.body});
              
              assert.isFalse(res.body.valid, 'Placement should be invalid');
              assert.property(res.body, 'conflict', 'response should contain conflict property');
              assert.isArray(res.body.conflict, 'conflict property should be an array');
              assert.equal(res.body.conflict.length, 1, 'conflict array should have one element');
              assert.include(res.body.conflict, 'row', 'conflict should be in row');
              done();
            });
        });

      test('Check a puzzle placement with missing puzzle field', (done) => {
          // Missing puzzle
          chai.request(server)
            .post('/api/check')
            .send({ coordinate: 'A2', value: '6' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'error', 'response should contain error property');
              assert.equal(res.body.error, 'Required field(s) missing');
   
            done();
            });
        });

        test('Check a puzzle placement with missing coordinate field', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', value: '6' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response should contain error property');
                assert.equal(res.body.error, 'Required field(s) missing');   
            done(); 
             });
        })


        test('Check a puzzle placement with missing value field', (done) => {

            chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response should contain error property');
                assert.equal(res.body.error, 'Required field(s) missing');

                done(); 
            })
        });

        test('Check a puzzle placement with invalid characters', (done) => {
            chai.request(server)
              .post('/api/check')
              .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.',
                coordinate: 'A2',
                value: '6'
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response should contain error property');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
              });
        });

        test('Check a puzzle placement with incorrect length', (done) => {
          chai.request(server)
            .post('/api/check')
            .send({
              puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.', // 80 caracteres
              coordinate: 'A2',
              value: '6'
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'error', 'response should contain error property');
              assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            });
        });

        test('Check a puzzle placement with invalid placement coordinate', (done) => {
          
            const invalidCoordinates = ['J1', 'A0', 'A10', 'AA1', '1A'];
            
            invalidCoordinates.forEach(coord => {
             chai.request(server)
               .post('/api/check')
               .send({
                 puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                 coordinate: coord,
                 value: '6'
               })
               .end((err, res) => {
                 assert.equal(res.status, 200);
                 assert.isObject(res.body, 'response should be an object');
                 assert.property(res.body, 'error', 'response should contain error property');
                 assert.equal(res.body.error, 'Invalid coordinate');
               });
            });
            done();
        });

        test('Check a puzzle placement with invalid placement value', (done) => {
          const invalidValues = ['0', '10', 'a', '.'];
          invalidValues.forEach(val => {
            chai.request(server)
              .post('/api/check')
              .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A2',
                value: val
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response should contain error property');
                assert.equal(res.body.error, 'Invalid value');
              });
          });
          done();
        });
    });

    suite('POST /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', (done) => {

          const puzzle = puzzlesAndSolutions[0][0];
          const expectedSolution = puzzlesAndSolutions[0][1];

          chai.request(server)
            .post('/api/solve')
            .send({ puzzle: puzzle })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'solution', 'response should contain solution property');
              assert.isString(res.body.solution, 'solution should be a string');
              assert.equal(res.body.solution.length, 81, 'solution should be 81 characters long');
              assert.equal(res.body.solution, expectedSolution, 'solution should match the expected solution');
              done();
            });
        });

        test('Solve a puzzle with missing puzzle string', (done) => {
          chai.request(server)
            .post('/api/solve')
            .send({}) // Enviamos un cuerpo vacío
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'error', 'response should contain error property');
              assert.equal(res.body.error, 'Required field missing');
              done();
            });
        });

        test('Solve a puzzle with invalid characters', (done) => {
          const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.';
          chai.request(server)
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'error', 'response should contain error property');
              assert.equal(res.body.error, 'Invalid characters in puzzle');
              done();
            });
        });

        test('Solve a puzzle with incorrect length', (done) => {
          const shortPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'; // 80 caracteres
          chai.request(server)
            .post('/api/solve')
            .send({ puzzle: shortPuzzle })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'error', 'response should contain error property');
              assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            });
        });

        test('Solve a puzzle that cannot be solved', (done) => {
          const unsolvablePuzzle = '119..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'; // El '1' está repetido en la primera fila
          chai.request(server)
            .post('/api/solve')
            .send({ puzzle: unsolvablePuzzle })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'error', 'response should contain error property');
              assert.equal(res.body.error, 'Puzzle cannot be solved');
              done();
            });
        });
    });

});

