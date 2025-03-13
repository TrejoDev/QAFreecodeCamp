'use strict';

let issues = [];
let issueCount = 0;

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      let project = req.params.project;
      let queryParams = req.query;

      let projectIssues = issues.filter(issue => {
        let match = true;

        for (let key in queryParams) {
          if (queryParams.hasOwnProperty(key)) {
            let value = queryParams[key];
            if (issue.hasOwnProperty(key)) {
              if (issue[key].toString() !== value) {
                match = false;
                break;
              }
            } else {
              match = false;
              break;
            }
          }
        }
        return match;
      });

      res.json(projectIssues); 
    })

    .post(function (req, res){
      let project = req.params.project;
      let issueData = req.body;

      if (!issueData.issue_title || !issueData.issue_text || !issueData.created_by) {
        return res.status(400).type('text/plain').send('required field(s) missing'); 
      }
     
      issueCount++;
      let newIssue = {
        _id: issueCount.toString(),
        issue_title: issueData.issue_title,
        issue_text: issueData.issue_text,
        created_by: issueData.created_by,
        assigned_to: issueData.assigned_to || '',
        status_text: issueData.status_text || '', 
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
        project: project
      };

      issues.push(newIssue);

      res.status(201).json(newIssue); 
  })


    .put(function (req, res){
    let project = req.params.project;
    let issueId = req.body._id;
    let updateData = req.body;

    if (!issueId) {
      return res.status(400).type('text/plain').send('{"error": "missing _id"}'); 
    }

    let issueIndex = issues.findIndex(issue => issue._id === issueId);

    if (issueIndex === -1) {
      return res.status(404).type('text/plain').send(`{"error": "could not update", "_id": "${issueId}"}`); 
    }

    let issueToUpdate = issues[issueIndex];
    let hasUpdates = false;

    for (let key in updateData) {
      if (updateData.hasOwnProperty(key) && key !== '_id') {
        issueToUpdate[key] = updateData[key];
        hasUpdates = true;
      }
    }

    if (!hasUpdates) {
      return res.status(400).type('text/plain').send(`{"error": "no update field(s) sent", "_id": "${issueId}"}`); 
    }

    issueToUpdate.updated_on = new Date();

    res.status(200).json({ result: 'successfully updated', '_id': issueId }); 
  })


  .delete(function (req, res){
  let project = req.params.project;
  let issueId = req.body._id;

  if (!issueId) {
    return res.status(400).type('text/plain').send('{"error": "missing _id"}'); 
  }

  let issueIndex = issues.findIndex(issue => issue._id === issueId);

  if (issueIndex === -1) {
    return res.status(404).type('text/plain').send(`{"error": "could not delete", "_id": "${issueId}"}`); 
  }

  issues.splice(issueIndex, 1);

  res.json({ result: 'successfully deleted', '_id': issueId }); 
}

)};