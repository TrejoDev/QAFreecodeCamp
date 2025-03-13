const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const PROJECT_NAME = 'qafreecodecamp';

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('POST /api/issues/{project}', function() {
    test('Create an issue with only required fields', function(done) {
    chai.request(server)
      .post(`/api/issues/${PROJECT_NAME}`)
      .send({ 
        issue_title: 'Test Issue Title Required',
        issue_text: 'Test Issue Text Required',
        created_by: 'Functional Test - Required fields'
      })
      .end(function(err, res){
        assert.equal(res.status, 201, 'Respuesta debe ser 201 Creado');
        assert.equal(res.type, 'application/json', 'Respuesta debe ser JSON');
        assert.isObject(res.body, 'Respuesta debe ser un objeto');
        assert.property(res.body, '_id', 'Respuesta debe contener _id');
        assert.property(res.body, 'issue_title', 'Respuesta debe contener issue_title');
        assert.equal(res.body.issue_title, 'Test Issue Title Required');
        assert.property(res.body, 'issue_text', 'Respuesta debe contener issue_text');
        assert.equal(res.body.issue_text, 'Test Issue Text Required');
        assert.property(res.body, 'created_by', 'Respuesta debe contener created_by');
        assert.equal(res.body.created_by, 'Functional Test - Required fields');
        assert.property(res.body, 'open', 'Respuesta debe contener open');
        assert.isBoolean(res.body.open, 'El campo "open" debe ser booleano');
        assert.property(res.body, 'created_on', 'Respuesta debe contener created_on');
        assert.property(res.body, 'updated_on', 'Respuesta debe contener updated_on');
        done();
      });
    });
  });

  suite('GET /api/issues/{project}', function() {
    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai.request(server)
      .get(`/api/issues/${PROJECT_NAME}`) 
      .query({}) 
      .end(function(err, res){
        assert.equal(res.status, 200, 'Respuesta debe ser 200 OK');
        assert.equal(res.type, 'application/json', 'Respuesta debe ser JSON');
        assert.isArray(res.body, 'Respuesta debe ser un array'); 
        
        done();
      });
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get(`/api/issues/${PROJECT_NAME}`)
        .query({ issue_title: 'Test Issue Title Required' }) 
        .end(function(err, res){
          assert.equal(res.status, 200, 'Respuesta debe ser 200 OK');
          assert.equal(res.type, 'application/json', 'Respuesta debe ser JSON');
          assert.isArray(res.body, 'Respuesta debe ser un array');
          done();
        });
    });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get(`/api/issues/${PROJECT_NAME}`)
        .query({ issue_title: 'Test Issue Title', created_by: 'Functional Test - Every field' }) 
        .end(function(err, res){
          assert.equal(res.status, 200, 'Respuesta debe ser 200 OK');
          assert.equal(res.type, 'application/json', 'Respuesta debe ser JSON');
          assert.isArray(res.body, 'Respuesta debe ser un array');
          done();
        });
    });
  });

  suite('PUT /api/issues/{project}', function() {
    let testIssueId; 

    before(function(done) {
      chai.request(server)
        .post(`/api/issues/${PROJECT_NAME}`)
        .send({
          issue_title: 'Issue to Update',
          issue_text: 'Text to Update',
          created_by: 'Updater'
        })
        .end(function(err, res){
          assert.equal(res.status, 201, 'Issue creation successful for PUT tests');
          testIssueId = res.body._id; 
          done();
        });
    });

    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: testIssueId, issue_text: 'Updated Text' }) 
        .end(function(err, res){
          assert.equal(res.status, 200, 'Respuesta debe ser 200 OK');
          assert.equal(res.type, 'application/json', 'Respuesta debe ser JSON');
          assert.equal(res.body.issue_text, 'Updated Text', 'issue_text debe ser actualizado');
          assert.notEqual(res.body.updated_on, res.body.created_on, 'updated_on debe ser diferente de created_on');
          done();
        });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: testIssueId, issue_title: 'Updated Title', status_text: 'In Progress' }) 
        .end(function(err, res){
          assert.equal(res.status, 200, 'Respuesta debe ser 200 OK');
          assert.equal(res.type, 'application/json', 'Respuesta debe ser JSON');
          assert.equal(res.body.issue_title, 'Updated Title', 'issue_title debe ser actualizado');
          assert.equal(res.body.status_text, 'In Progress', 'status_text debe ser actualizado');
          assert.notEqual(res.body.updated_on, res.body.created_on, 'updated_on debe ser diferente de created_on');
          done();
        });
    });

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ issue_text: 'Trying to update without _id' }) 
        .end(function(err, res){
          assert.equal(res.status, 400, 'Respuesta debe ser 400 Fallo');
          assert.equal(res.type, 'text/plain', 'Respuesta debe ser text/plain');
          assert.equal(res.text, 'Error: missing _id', 'Mensaje de error correcto');
          done();
        });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: testIssueId }) 
        .end(function(err, res){
          assert.equal(res.status, 400, 'Respuesta debe ser 400 Fallo');
          assert.equal(res.type, 'text/plain', 'Respuesta debe ser text/plain');
          assert.equal(res.text, 'No updated field sent', 'Mensaje de error correcto');
          done();
        });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: 'invalid-id', issue_text: 'Trying to update with invalid id' }) 
        .end(function(err, res){
          assert.equal(res.status, 404, 'Respuesta debe ser 404 No encontrado');
          assert.equal(res.type, 'text/plain', 'Respuesta debe ser text/plain');
          assert.equal(res.text, 'Could not update invalid-id', 'Mensaje de error correcto');
          done();
        });
    });
  });
  
  suite('DELETE /api/issues/{project}', function() { 
    let testIssueIdToDelete;

    before(function(done) { 
      chai.request(server)
        .post(`/api/issues/${PROJECT_NAME}`)
        .send({
          issue_title: 'Issue to Delete',
          issue_text: 'Text for Delete Test',
          created_by: 'Deleter Test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 201, 'Issue creation successful for DELETE tests');
          testIssueIdToDelete = res.body._id;
          done();
        });
    });

    test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: testIssueIdToDelete })
        .end(function(err, res){
          assert.equal(res.status, 200, 'Respuesta debe ser 200 OK');
          assert.equal(res.type, 'application/json', 'Respuesta debe ser JSON');
          assert.property(res.body, 'result', 'Respuesta debe contener "result"');
          assert.equal(res.body.result, 'success', 'El valor de "result" debe ser "success"');
          assert.property(res.body, '_id', 'Respuesta debe contener "_id"');
          assert.equal(res.body._id, testIssueIdToDelete, 'El "_id" en la respuesta debe coincidir con el _id enviado');
          done();
        });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
      const invalidDeleteId = 'invalid-delete-id';
      chai.request(server)
        .delete(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: invalidDeleteId })
        .end(function(err, res){
          assert.equal(res.status, 404, 'Respuesta debe ser 404 No encontrado');
          assert.equal(res.type, 'text/plain', 'Respuesta debe ser text/plain');
          assert.equal(res.text, `Could not delete ${invalidDeleteId}`, 'Mensaje de error correcto para _id inválido');

          done();
        });
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete(`/api/issues/${PROJECT_NAME}`)
        .send({}) 
        .end(function(err, res){
          assert.equal(res.status, 400, 'Respuesta debe ser 400 Fallo');
          assert.equal(res.type, 'text/plain', 'Respuesta debe ser text/plain');
          assert.equal(res.text, 'Error: missing _id', 'Mensaje de error correcto para _id faltante');

          done();
        });
    });
  });
  
  
});
