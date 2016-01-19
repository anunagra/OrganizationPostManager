// app/routes.js
var comment = require('./../models/comment');

module.exports = function(app) {
    app.post('/api/v1/comments', function(req, res) {
     console.log("get comments");
       comment.find( {} ,function(err , data) {
          if (err) {
              var error = {};
              error.name = err.name;
              error.message = err.err;
              error.code = err.code;
              var errorObj = {"error" : error}
              res.send(errorObj);
           } else {
             var success = {};
             var responseObj ={};
             success.message ="Users found";
             success.code = "USERS_FOUND";
             success.commentsObj = data;
             responseObj.success = success;
            res.send(responseObj);
          }
        });
    });
    
    
/*     app.delete('/api/v1/comment/:commentid', function(req, res) {
       comment.remove( { userName : req.params.commentid } ,function(err , data) {
          if (err) {
              var error = {};
              error.name = err.name;
              error.message = err.err;
              error.code = err.code;
              var errorObj = {"error" : error}
              res.send(errorObj);
           } else {
             console.log(data);
             var success = {};
             var responseObj ={};
             success.message ="comment deleted";
             success.code = "COMMENT_DELETED";
             responseObj.success = success;
            res.send(responseObj);
          }
        });
    });*/
    
    
    // create user 
   /*app.post('/api/v1/comment', function(req, res) {
      var newcomment = new comment({
          description : req.body.description,
          type: "string",
          ownerId: req.body.username,
          groupId: ""
        });

       newcomment.save(function(err ,data) {
          if (err) {
              var error = {};
              error.name = err.name;
              error.message = err.err;
              error.code = err.code;
              var errorObj = {"error" : error}
              res.send(errorObj);
           }
          else {
              var success = {};
              success.message = "User created !";
              success.dbObj = data ;
              var successObj = {"success" : success};
              res.send(successObj);
          }
        });
    });*/


};