/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

let expect = require('chai').expect;
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const MONGODB_CONNECTION_STRING = process.env.DATABASE;
mongoose.connect(MONGODB_CONNECTION_STRING);

let bookSchema = new Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, required: true, default: 0 },
  comments: [String]
});

let Book = mongoose.model('Book', bookSchema);

module.exports = (app) => {

  app.route('/api/books')
    .get((req, res) => {
      Book.find({}, (err, books) => {
        if (err) return;
        res.json(books);
      });
    })
    
    .post((req, res) => {
      let title = req.body.title;
      if (title === undefined || title === '') {
        res.send('Missing title');
        return;
      }
      
      Book.create({ title: title, comments: [], commentcount: 0 }, (err, newBook) => {
        if (err) return;
        res.json(newBook);
        return;
      });
    })
    
    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, result) => {
        if (err) return;
        res.send('Complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get((req, res) => {
      let bookId = req.params.id;
      if (bookId === undefined || bookId === '') {
        res.send('Must enter a valid bookId');
        return;
      }
      Book.findById(bookId, (err, foundBook) => {
        if (err) {
          res.send('That book does not exist');
          return;
        }
        res.json(foundBook);
        return;
      });
    })
    
    .post((req, res) => {
      let bookId = req.params.id;
      let comment = req.body.comment;
      let comments = [];
      let commentCount = 0;
    
      if (comment === undefined || comment === '') {
        res.send('Missing comment');
        return;
      }
    
      Book.findByIdAndUpdate(bookId, { $push: { comments: comment }, $inc: { commentcount: 1 } }, { new: true }, (err, newBook) => {
        if (err) {
          res.send('Could not add comment');
          return;
        }
        res.json(newBook);
      });
      
    })
    
    .delete((req, res) => {
      var bookId = req.params.id;
      Book.findByIdAndDelete(bookId, (err, result) => {
        if (err) {
          res.send('That book does not exist');
          return;
        }
        res.send('Delete successful');
        return;
      });
    });
};
