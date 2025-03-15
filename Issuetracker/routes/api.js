'use strict';

module.exports = function (app) {
let issues = [];
  app.route('/api/issues/:project')

    .get(function (req, res){
      let project = req.params.project;
      let queryParams = req.query;

      let projectIssues = issues.filter(issue => issue.project === project).filter(issue => {
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
        return res.json({error: "required field(s) missing"}); 
      }
     
      let newIssue = {
        _id: crypto.randomUUID(),
        issue_title: issueData.issue_title,
        issue_text: issueData.issue_text,
        created_by: issueData.created_by,
        assigned_to: issueData.assigned_to || '',
        status_text: issueData.status_text || '', 
        open: true,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        project: project
      };

      issues.push(newIssue);

      res.status(201).json(newIssue); 
  })


    .put(function (req, res){
    let _id = req.body._id;
    let updateData = req.body;

    if (!_id) {
      return res.json({error: 'missing _id'}); 
    }

    let issueIndex = issues.findIndex(issue => issue._id === _id);

    if (issueIndex === -1) {
      return res.json({error: 'could not update', '_id': _id }); 
    }
    

    let issueToUpdate = issues[issueIndex];
    let hasUpdates = false;

    for (let key in updateData) {
      if (updateData.hasOwnProperty(key) && key !== '_id') {
        if (updateData[key] !== undefined && updateData[key] !== '') { 
          issueToUpdate[key] = updateData[key];
          hasUpdates = true;
        }
      }
    }

    if (!hasUpdates) {
      return res.json({error: 'no update field(s) sent', '_id': _id }); 
    }

    issueToUpdate.updated_on = new Date().toISOString();

    res.json({ result: 'successfully updated', '_id': _id }); 
  })

  .delete(function (req, res){
  let issueId = req.body._id;

  if (!issueId) {
    return res.json({error: 'missing _id'}); 
  }

  let issueIndex = issues.findIndex(issue => issue._id === issueId);

  if (issueIndex === -1) {
    return res.json({error: 'could not delete', '_id': issueId}); 
  }

  issues.splice(issueIndex, 1);

  res.json({ result: 'successfully deleted', '_id': issueId }); 
}

)};