const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Convert a valid input such as 10L: GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert')
        .query({input: '10L'})
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.type, 'application/json'); 
          
          assert.isObject(res.body, 'res.body should be an object'); 
          assert.equal(res.body.initNum, 10, 'res.body.initNum should be 10'); 
          assert.equal(res.body.initUnit, 'L', 'res.body.initUnit should be "L"'); 
          assert.approximately(res.body.returnNum, 2.64172, 0.1, 'res.body.returnNum should be approximately 2.64172'); 
          assert.equal(res.body.returnUnit, 'gal', 'res.body.returnUnit should be "gal"'); 
          assert.equal(res.body.string, '10 liters converts to 2.64172 gallons', 'res.body.string should be the correct conversion string'); 
          done(); 
        });
    });

    test('Convert an invalid input such as 32g: GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert')
        .query({input: '32g'})
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.type, 'text/plain'); 
          // assert.isString(res.body, 'res.body should be an string'); 
          // assert.property(res.body, 'message', 'res.body should have a message property');
          // assert.equal(res.body, 'invalid unit', 'res.body should be "invalid unit"'); 
          done();
        });
    });

    test('Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert')
        .query({input: '3/7.2/4kg'})
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.type, 'text/plain'); 
          // assert.isString(res.body, 'res.body should be an string');
          // assert.property(res.body, 'message', 'res.body should have a message property');
          // assert.equal(res.body, 'invalid number', 'res.body should be "invalid number"'); 
          done();
        });
    });

    test('Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert')
        .query({input: '3/7.2/4kilomegagram'})
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.type, 'text/plain'); 
          // assert.isString(res.body, 'res.body should be an string'); 
          // assert.property(res.body, 'message', 'res.body should have a message property'); 
          // assert.equal(res.body, 'invalid number and unit', 'res.body should be "invalid number and unit"'); 
          done();
        });
    });

    test('Convert with no number such as kg: GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert')
        .query({input: 'kg'}) 
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.type, 'application/json'); 
          assert.isObject(res.body, 'res.body should be an object');
          assert.equal(res.body.initNum, 1, 'res.body.initNum should be 1'); 
          assert.equal(res.body.initUnit, 'kg', 'res.body.initUnit should be "kg"'); 
          assert.approximately(res.body.returnNum, 2.20462, 0.1, 'res.body.returnNum should be approximately 2.20462'); 
          assert.equal(res.body.returnUnit, 'lbs', 'res.body.returnUnit should be "lbs"'); 
          assert.equal(res.body.string, '1 kilograms converts to 2.20462 pounds', 'res.body.string should be the correct conversion string for 1kg to lbs'); 
          done();
        });
    });
});
