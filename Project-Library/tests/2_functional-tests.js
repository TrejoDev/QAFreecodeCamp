/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/books');
chai.use(chaiHttp);

let bookId; 
chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    beforeEach(async function() {
    try {
      await Book.deleteMany({}); 
    } catch (err) {
      console.error('Error cleaning database:', err);
      throw err; 
    }
  });


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book Title' }) 
          .end(function(err, res){
            assert.equal(res.status, 200); 
            assert.isObject(res.body, 'response should be an object'); 
            assert.property(res.body, '_id', 'response should contain _id'); 
            assert.property(res.body, 'title', 'response should contain title'); 
            assert.equal(res.body.title, 'Test Book Title', 'title should match'); 
            bookId = res.body._id; 
            done(); 
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({}) 
          .end(function(err, res){
            // assert.equal(res.status, 400); 
            // assert.isObject(res.body, 'response should be an object'); 
            // assert.property(res.body, 'error', 'response should contain error'); 
            assert.equal(res.text, 'missing required field title', 'error message should match'); 
            done(); 
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200); 
            assert.isArray(res.body, 'response should be an array'); 
            
            if (res.body.length > 0) {
              assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
              assert.property(res.body[0], 'title', 'Books in array should contain title');
              assert.property(res.body[0], '_id', 'Books in array should contain _id');
            }
            done(); 
          });
      });     
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/invalid-id') 
          .end(function(err, res){
            // assert.equal(res.status, 400); 
            // assert.isObject(res.body, 'response should be an object'); 
            // assert.property(res.body, 'error', 'response should contain error'); 
            assert.equal(res.text, 'invalid bookid', 'error message should match'); 
            done(); 
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for GET by ID' })
          .then(function(postRes) {
            assert.equal(postRes.status, 200);
            assert.property(postRes.body, '_id', 'POST response should contain _id');
            createdBookId = postRes.body._id;
          
            chai.request(server)
              .get('/api/books/' + createdBookId)
              .end(function(err, getRes){
                assert.equal(getRes.status, 200);
                assert.isObject(getRes.body, 'response should be an object');
                assert.property(getRes.body, '_id', 'response should contain _id');
                assert.property(getRes.body, 'title', 'response should contain title');
                assert.isArray(getRes.body.comments, 'response should contain comment array');
                assert.equal(getRes.body._id, createdBookId, 'IDs should match');
                assert.equal(getRes.body.title, 'Test Book for GET by ID', 'Title should match');
                done();
              });
          })
          .catch(function(err) {
            console.error("Error during POST request:", err);
            done(err);
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
            
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for Comment' })
          .then(function(postRes) {
            assert.equal(postRes.status, 200);
            assert.property(postRes.body, '_id', 'POST response should contain _id');
            createdBookId = postRes.body._id;
          
            chai.request(server)
              .post('/api/books/' + createdBookId)
              .send({ comment: 'This is a test comment' })
              .end(function(err, commentRes){
                
                assert.equal(commentRes.status, 200);
                assert.isObject(commentRes.body, 'response should be an object');
                assert.property(commentRes.body, '_id', 'response should contain _id');
                assert.property(commentRes.body, 'title', 'response should contain title');
                assert.isArray(commentRes.body.comments, 'response should contain comments array');
                assert.equal(commentRes.body._id, createdBookId, 'IDs should match');
                assert.include(commentRes.body.comments, 'This is a test comment', 'Comment should be included in the comment array');
                done();
              });
          })
          .catch(function(err) {
            console.error("Error during initial POST request:", err);
            done(err);
          });
      });

     test('Test POST /api/books/[id] without comment field', function(done){
        
      chai.request(server)
        .post('/api/books')
        .send({ title: 'Test Book for No Comment' })
        .then(function(postRes) {
          assert.equal(postRes.status, 200);
          assert.property(postRes.body, '_id', 'POST response should contain _id');
          createdBookId = postRes.body._id;
        
          chai.request(server)
            .post('/api/books/' + createdBookId)
            .send({}) 
            .end(function(err, commentRes){
              // assert.equal(commentRes.status, 400);
              // assert.isObject(commentRes.body, 'response should be an object'); 
              // assert.property(commentRes.body, 'error', 'response should contain error'); 
              assert.equal(commentRes.text, 'missing required field comment', 'error message should match'); 
              done();
            });
        })
        .catch(function(err) {
          console.error("Error during initial POST request:", err);
          done(err);
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/nonexistent-id') 
          .send({ comment: 'This comment should not be added' })
          .end(function(err, commentRes){
            assert.equal(commentRes.status, 400); 
            assert.isObject(commentRes.body, 'response should be an object'); 
            assert.property(commentRes.body, 'error', 'response should contain error'); 
            assert.equal(commentRes.body.error, 'invalid bookid', 'error message should match'); 
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
            
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Book to be deleted' })
          .then(function(postRes) {
            assert.equal(postRes.status, 200);
            assert.property(postRes.body, '_id', 'POST response should contain _id');
            createdBookId = postRes.body._id;
          
            chai.request(server)
              .delete('/api/books/' + createdBookId)
              .end(function(err, deleteRes){
                assert.equal(deleteRes.status, 200);
                assert.equal(deleteRes.text, 'delete successful', 'Response should be "delete successful"');
              
               done();
              });
          })
          .catch(function(err) {
            console.error("Error during initial POST request:", err);
            done(err);
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/nonexistent-id') 
          .end(function(err, deleteRes){
            assert.equal(deleteRes.status, 400); 
            assert.isObject(deleteRes.body, 'response should be an object'); 
            assert.property(deleteRes.body, 'error', 'response should contain error'); 
            assert.equal(deleteRes.body.error, 'invalid bookid', 'error message should match'); 
            done();
          });
      });

    });

  });

});
