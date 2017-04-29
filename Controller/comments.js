'use strict';

const commentSchema = require('../Model/commentSchema');
const articleSchema = require('../Model/articleSchema');

const express	= require('express');
const router	= express.Router();

// -------------------------------------------------------------------------- //
//                                 Init                                       //
// -------------------------------------------------------------------------- //
let id = 0;

commentSchema.findOne({}, null, {sort: {id: -1}}, function(err, result) {
  if (err) {
    console.log(err);
  }
  else {
    if (result !== undefined && result !== null && result.id !== NaN) {
      id = result.id;
    }
  }
});

// -------------------------------------------------------------------------- //
//                                Events                                      //
// -------------------------------------------------------------------------- //
let commentEvent = function(ServerEvent) {
  
  ServerEvent.on('saveComment', function(data, socket) {
    var newComment = new commentSchema({
      article_id    : data.article_id,
      pseudo        : data.pseudo,
      text          : data.text
    });
    
    console.log(newComment);
    
    newComment.save(function(err) {
      if (err) {
        //throw err;
        console.error(err);
      }
      else {
        delete data.text;
        ServerEvent.emit('CommentSaved', newComment, socket);
      }
    });
  });
  
  ServerEvent.on('rmComment', function(data, socket) {
    commentSchema.findOneAndRemove({_id : data.id}, {new: true}, function (err, result) {
      if (err) {
        console.log('err: ', err);
      }
      else {
        console.log('Commentaire Supprimé: ', result);
        ServerEvent.emit('CommentRemoved', result, socket);
      }
    });
  });
};

// Export
exports.commentEvent = commentEvent;
exports.router = router;