/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB);
const Book = require('../models/books');



module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        const books = await Book.find({})
          .select('_id title comment') 
          .lean() 
          .exec();

        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comment.length
        }));
        res.json(formattedBooks);
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Could not retrieve books' });
      }
    })
    
    .post(async function (req, res){
      const {title, comment} = req.body;
      
      if (!title) {
        return res.send( 'missing required field title' );
        
      }
      const newBook = new Book({ title: title, comment});
      try {
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title });
      } catch (err) {
        console.error(err);
        res.json({ error: 'Could not save book' });
      }
    })
    
    .delete(async function(req, res){
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        console.error(err);
        res.json({ error: 'Could not delete all books' });
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.send('invalid bookid' );
        }
        const book = await Book.findById(bookid).exec();
        if (!book) {
          return res.send('no book exists');
        }
        res.json({ _id: book._id, title: book.title, comments: book.comment });
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Could not retrieve book' });
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send( 'missing required field comment' );
      }

      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.status(400).json({ error: 'invalid bookid' });
        }

        const book = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comment: comment } },
          { new: true } 
        ).exec();

        if (!book) {
          return res.send('no book exists' );
        }

        res.json({ _id: book._id, title: book.title, comments: book.comment });
      } catch (err) {
        console.error(err);

        res.status(400).json({ error: 'Could not add comment' });
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;

      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.status(400).json({ error: 'invalid bookid' });
        }

        const deletedBook = await Book.findByIdAndDelete(bookid).exec();

        if (!deletedBook) {
          return res.send('no book exists' );
        }

        res.send('delete successful');
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Could not delete book' });
      }
    });
  
};
