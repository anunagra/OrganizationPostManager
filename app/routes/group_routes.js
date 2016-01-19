// app/routes.js
var group = require('./../models/group');

module.exports = function(app) {

   app.post('/api/v1/group', function(req, res) {
       var members = [];
       members = JSON.parse(req.body.groupMembers);
       
       var newGroup = new group({
            groupName : req.body.groupName,
            groupAdmin : req.body.groupAdmin,
            groupMembers : req.body.groupMembers
        });

       newGroup.save(function(err ,data) {
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
    
    app.post('/api/v1/groups', function(req, res) {
       group.find( {} , function(err ,data) {
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
              success.message = "groups found !";
              success.groupsObj = data ;
              var successObj = {"success" : success};
              res.send(successObj);
          }
        });
    });
    
    
     app.delete('/api/v1/group/:groupName', function(req, res) {
       group.remove( { groupName : req.params.groupName } ,function(err , data) {
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
             success.message ="group deleted";
             success.code = "GROUP_DELETED";
             responseObj.success = success;
            res.send(responseObj);
          }
        });
    });
     app.post('/api/v1/groups', function(req, res) {
       group.find( {} , function(err ,data) {
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
              success.message = "groups found !";
              success.groupsObj = data ;
              var successObj = {"success" : success};
              res.send(successObj);
          }
        });
    });


};