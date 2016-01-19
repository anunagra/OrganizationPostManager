// app/routes.js
var user = require('./../models/user');

module.exports = function(app) {
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

     app.get('/api/v1/user/:username', function(req, res) {
       console.log("user name" + req.params.username )
       user.findOne( { userName : req.params.username } ,function(err , data) {
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
             success.message ="User found";
             success.code = "USER_FOUND";
             success.usersObj = data;
             responseObj.success = success;
            res.send(responseObj);
          }
        });
    });
    
     app.delete('/api/v1/user/:username', function(req, res) {
       user.remove( { userName : req.params.username } ,function(err , data) {
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
             success.message ="user deleted";
             success.code = "USER_DELETED";
             responseObj.success = success;
            res.send(responseObj);
          }
        });
    });
    
    app.get('/api/v1/users', function(req, res) {
       user.find( { type : { $ne: "1" }} ,function(err , data) {
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
             success.usersObj = data;
             responseObj.success = success;
            res.send(responseObj);
          }
        });
    });
    
    
    // create user 
    app.post('/api/v1/user', function(req, res) {
        // use mongoose to get all nerds in the database
     console.log( req.body.firstname +" "+req.body.lastname+" "+req.body.username +" "+req.body.password +" "+req.body.role);
     var newuser = new user({
          firstName : req.body.firstname,
          lastName: req.body.lastname ,
          userName: req.body.username,
          password: req.body.password,
          type: req.body.role
        });
    
    // save the user
       newuser.save(function(err ,data) {
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
    });
    
    
     app.post('/api/v1/userdata', function(req, res) {
       user.findOne( {userName: req.body.username } ,function(err , data) {
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
              var failure = {};
              var responseObj = {};
              if(data){ 
                 if(data.password == req.body.password){
                     success.message ="User found";
                     success.code = "USER_FOUND";
                     success.userObj = data;
                     responseObj.success = success;
                 }else{
                      failure.message = "Password donot match !!";
                      failure.code ="PASSWORD_DONOT_MATCH";
                      failure.dbObj = data ;
                      responseObj.failure = failure;
                 }
                  
              }else{
                  failure.message = "User not found !";
                  failure.code ="USERNAME_NOT_FOUND";
                  failure.dbObj = data ;
                  responseObj.failure = failure;
              }
             
              res.send(responseObj);
          }
        });
    });
      
    
    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });

};