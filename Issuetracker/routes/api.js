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
              if (issue[key] !== value) { 
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

      console.log("Issues filtrados para el proyecto:", projectIssues); // LOG para depuración
      res.status(200).type('application/json').send(projectIssues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issueData = req.body; 

      if (!issueData.issue_title || !issueData.issue_text || !issueData.created_by) {
        return res.status(400).type('text').send('Error: missing required field(s)'); 
      }

      issueCount++; 
      let newIssue = {
        _id: issueCount.toString(), 
        issue_title: issueData.issue_title,
        issue_text: issueData.issue_text,
        created_by: issueData.created_by,
        assigned_to: issueData.assigned_to || '', 
        status_text: issueData.status_text || 'Open', 
        open: true,
        created_on: new Date().toISOString(), 
        updated_on: new Date().toISOString(), 
        project: project 
      };

      issues.push(newIssue);

      res.status(201).type('application/json').send(newIssue); 
  })

    
    .put(function (req, res){
      let project = req.params.project;
      res.json('put')
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      res.json('delete')
    });
    
};
