const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const PROJECT_NAME = 'qafreecodecamp';

chai.use(chaiHttp);

suite('Functional Tests', function() {

    
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
