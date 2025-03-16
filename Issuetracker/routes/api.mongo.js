'use strict';

const Issue = require('../models/issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res){
      let project = req.params.project;
      let queryParams = req.query;

      try {
        const issues = await Issue.find({ project, ...queryParams }).exec();
        res.json(issues);
      } catch (err) {
        res.json({ error: 'could not retrieve issues' });
      }
    })

    .post(async function (req, res){
      let project = req.params.project;
      let issueData = req.body;

     if (!issueData.issue_title || !issueData.issue_text || !issueData.created_by) {
        return res.json({error: "required field(s) missing"}); 
      }

      const newIssue = new Issue({
        issue_title: issueData.issue_title,
        issue_text: issueData.issue_text,
        created_by: issueData.created_by,
        assigned_to: issueData.assigned_to || '',
        status_text: issueData.status_text || '',
        project: project
      });

      try {
        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
      } catch (err) {
        res.json({ error: 'could not save issue' });
      }
    })

    .put(async function (req, res){
      let _id = req.body._id;
      let updateData = req.body;

      if (!_id) {
      return res.json({error: 'missing _id'}); 
    }

      const updates = {};
      for (const key in updateData) {
        if (key !== '_id' && updateData[key] !== '') {
          updates[key] = updateData[key];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.json({error: 'no update field(s) sent', '_id': _id }); 
      }

      updates.updated_on = new Date();

      try {
        const updatedIssue = await Issue.findByIdAndUpdate(_id, updates, { new: true }).exec();
        if (!updatedIssue) {
          return res.json({error: 'could not update', '_id': _id }); 
        }
        res.json({ result: 'successfully updated', '_id': _id });
      } catch (err) {
        res.status(400).type('text/plain').send(JSON.stringify({ error: "could not update", _id: _id }));
      }
    })

    .delete(async function (req, res){
      let _id = req.body._id;

      if (!_id) {
        return res.json({error: 'missing _id'});
      }

      try {
        const deletedIssue = await Issue.findByIdAndDelete(_id).exec();
        if (!deletedIssue) {
          return res.json({error: 'could not delete', '_id': issueId}); 
        }
        res.json({ result: 'successfully deleted', '_id': _id });
      } catch (err) {
        return res.json({error: 'could not delete', '_id': issueId}); 
      }
    });

};