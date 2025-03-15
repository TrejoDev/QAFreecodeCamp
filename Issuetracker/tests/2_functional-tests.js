const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const PROJECT_NAME = 'qafreecodecamp';

chai.use(chaiHttp);

suite('Functional Tests', function() {

    test('1-Create an issue with every field: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post(`/api/issues/${PROJECT_NAME}`)
        .send({
          issue_title: 'Test issue with all fields',
          issue_text: 'This is a test issue to ensure all fields are handled correctly.',
          created_by: 'Tester User',
          assigned_to: 'Assignee User',
          status_text: 'In Progress'
        })
        .end(function(err, res){
          assert.equal(res.status, 201, 'Test 1: Status should be 201');
          assert.equal(res.type, 'application/json', 'Test 1: Response should be JSON');
          assert.property(res.body, '_id', 'Test 1: Issue should have an _id');
          assert.equal(res.body.issue_title, 'Test issue with all fields', 'Test 1: Title should match');
          assert.equal(res.body.issue_text, 'This is a test issue to ensure all fields are handled correctly.', 'Test 1: Text should match');
          assert.equal(res.body.created_by, 'Tester User', 'Test 1: Created by should match');
          assert.equal(res.body.assigned_to, 'Assignee User', 'Test 1: Assigned to should match');
          assert.equal(res.body.status_text, 'In Progress', 'Test 1: Status should match');
          assert.isBoolean(res.body.open, 'Test 1: Open should be a boolean');
          assert.equal(res.body.open, true, 'Test 1: Open should be true');
          assert.property(res.body, 'created_on', 'Test 1: Should have created_on');
          assert.property(res.body, 'updated_on', 'Test 1: Should have updated_on');
          assert.equal(res.body.project, PROJECT_NAME, 'Test 1: Project name should match');
          done();
        });
    });

    test('2-Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post(`/api/issues/${PROJECT_NAME}`)
        .send({
          issue_title: 'Test issue with required fields only',
          issue_text: 'This issue tests creation with only the essential fields.',
          created_by: 'Required User'
        })
        .end(function(err, res){
          assert.equal(res.status, 201, 'Test 2: Status should be 201');
          assert.equal(res.type, 'application/json', 'Test 2: Response should be JSON');
          assert.property(res.body, '_id', 'Test 2: Issue should have an _id');
          assert.equal(res.body.issue_title, 'Test issue with required fields only', 'Test 2: Title should match');
          assert.equal(res.body.issue_text, 'This issue tests creation with only the essential fields.', 'Test 2: Text should match');
          assert.equal(res.body.created_by, 'Required User', 'Test 2: Created by should match');
          assert.equal(res.body.assigned_to, '', 'Test 2: Assigned to should be empty');
          assert.equal(res.body.status_text, '', 'Test 2: Status should be empty');
          assert.isBoolean(res.body.open, 'Test 2: Open should be a boolean');
          assert.equal(res.body.open, true, 'Test 2: Open should be true');
          assert.property(res.body, 'created_on', 'Test 2: Should have created_on');
          assert.property(res.body, 'updated_on', 'Test 2: Should have updated_on');
          assert.equal(res.body.project, PROJECT_NAME, 'Test 2: Project name should match');
          done();
        });
    });

    test('3-Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
      chai.request(server)
        .post(`/api/issues/${PROJECT_NAME}`)
        .send({issue_text: 'This issue is missing the title.', created_by: 'Missing Title User'})
        .end(function(err, res){
          // assert.equal(res.status, 400, 'Test 3: Status should be 400');
          assert.equal(res.type, 'application/json', 'Test 3: Response should be JSON');
          
          assert.deepEqual(res.body, { error: 'required field(s) missing' }, 'Test 3: Error message should match');
          done();
        });
    });

    test('4-View issues on a project: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get(`/api/issues/${PROJECT_NAME}`)
        .end(function(err, res){
          assert.equal(res.status, 200, 'Test 4: Status should be 200');
          assert.equal(res.type, 'application/json', 'Test 4: Response should be JSON');
          assert.isArray(res.body, 'Test 4: Response should be an array');
          done();
        });
    });

    let issueIdForUpdateAndDelete; 

    before(function(done) {
      chai.request(server)
        .post(`/api/issues/${PROJECT_NAME}`)
        .send({
          issue_title: 'Test issue for update/delete',
          issue_text: 'This issue will be used for update and delete tests.',
          created_by: 'Setup User'
        })
        .end(function(err, res){
          issueIdForUpdateAndDelete = res.body._id;
          done();
        });
    });

    test('5-View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get(`/api/issues/${PROJECT_NAME}?open=true`)
        .end(function(err, res){
          assert.equal(res.status, 200, 'Test 5: Status should be 200');
          assert.equal(res.type, 'application/json', 'Test 5: Response should be JSON');
          assert.isArray(res.body, 'Test 5: Response should be an array');

          if (res.body.length > 0) {
            assert.equal(res.body[0].open, true, 'Test 5: Should filter by open=true');
          }
          done();
        });
    });

    test('6-View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
      chai.request(server)
        .get(`/api/issues/${PROJECT_NAME}?open=true&created_by=Setup%20User`)
        .end(function(err, res){
          assert.equal(res.status, 200, 'Test 6: Status should be 200');
          assert.equal(res.type, 'application/json', 'Test 6: Response should be JSON');
          assert.isArray(res.body, 'Test 6: Response should be an array');
          
          if (res.body.length > 0) {
            assert.equal(res.body[0].open, true, 'Test 6: Should filter by open=true');
            assert.equal(res.body[0].created_by, 'Setup User', 'Test 6: Should filter by created_by');
          }
          done();
        });
    });

    test('7-Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: issueIdForUpdateAndDelete, issue_text: 'Updated issue text.' })
        .end(function(err, res){
          assert.equal(res.status, 200, 'Test 7: Status should be 200');
          assert.equal(res.type, 'application/json', 'Test 7: Response should be JSON');
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': issueIdForUpdateAndDelete }, 'Test 7: Success message should match');
          done();
        });
    });

    test('8-Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: issueIdForUpdateAndDelete, issue_title: 'Updated title.', status_text: 'In Review' })
        .end(function(err, res){
          assert.equal(res.status, 200, 'Test 8: Status should be 200');
          assert.equal(res.type, 'application/json', 'Test 8: Response should be JSON');
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': issueIdForUpdateAndDelete }, 'Test 8: Success message should match');
          done();
        });
    });

    test('9-Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ issue_text: 'Attempt to update without _id.' })
        .end(function(err, res){
          // assert.equal(res.status, 400, 'Test 9: Status should be 400');
          assert.equal(res.type, 'application/json', 'Test 9: Response should be JSON');
          assert.deepEqual(res.body,  { error: 'missing _id' } , 'Test 9: Error message should match');
          done();
        });
    });

    test('10-Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: issueIdForUpdateAndDelete })
        .end(function(err, res){
          // assert.equal(res.status, 400, 'Test 10: Status should be 400');
          assert.equal(res.type, 'application/json', 'Test 10: Response should be JSON');
          assert.deepEqual(res.body, {error: 'no update field(s) sent', _id: issueIdForUpdateAndDelete}, 'Test 10: Error message should match');
          done();
        });
    });

    test('11-Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
      chai.request(server)
        .put(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: 'invalid-id', issue_text: 'Attempt to update with invalid id.' })
        .end(function(err, res){
          // assert.equal(res.status, 404, 'Test 11: Status should be 404');
          assert.equal(res.type, 'application/json', 'Test 11: Response should be JSON');
          assert.deepEqual(res.body,  {error: 'could not update', _id: 'invalid-id'}, 'Test 11: Error message should match');
          done();
        });
    });

    test('12-Delete an issue: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: issueIdForUpdateAndDelete })
        .end(function(err, res){
          assert.equal(res.status, 200, 'Test 12: Status should be 200');
          assert.equal(res.type, 'application/json', 'Test 12: Response should be JSON');
          assert.deepEqual(res.body, { result: 'successfully deleted', '_id': issueIdForUpdateAndDelete }, 'Test 12: Success message should match');
          done();
        });
    });

    test('13-Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete(`/api/issues/${PROJECT_NAME}`)
        .send({ _id: 'invalid-delete-id' })
        .end(function(err, res){
          // assert.equal(res.status, 404, 'Test 13: Status should be 404');
          assert.equal(res.type, 'application/json', 'Test 13: Response should be JSON');
          assert.deepEqual(res.body,{error: "could not delete", _id: "invalid-delete-id"}, 'Test 13: Error message should match');
          done();
        });
    });

    test('14-Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
      chai.request(server)
        .delete(`/api/issues/${PROJECT_NAME}`)
        .send({})
        .end(function(err, res){
          // assert.equal(res.status, 400, 'Test 14: Status should be 400');
          assert.equal(res.type, 'application/json', 'Test 14: Response should be JSON');
          assert.deepEqual(res.body, {error: "missing _id"}, 'Test 14: Error message should match');
          done();
        });
    });

});