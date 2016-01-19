// app/routes.js
var comment = require('./../models/comment');
 var io = require('socket.io')();

module.exports = function(socket) {
   // broadcast a user's message to other users
      socket.on('send:message', function (data) {
           var newMsg = new comment({
              username: data.username,
              ownerType: data.type,
              description: data.message,
              room: "school",      
              ownerId: data.username,
              groupId: ""
            });
        //Save it to database
        newMsg.save(function(err, msg){
          //Send message to those connected in the room
           socket.broadcast.emit('message-sent', {
              description: msg.description,
              created_at : msg.created_at ,
              ownerType : msg.ownerType
           });
        });
         
      });
      
    
     socket.on('delete:message', function (data) { 
        //Save it to database
        comment.remove({_id : data.message_id} , function(err, msg){
          //Send message to those connected in the room
           socket.broadcast.emit('message-deleted', {
               reloadList : "true"
           });
        });
         
      });
    
      
      //Globals
      var defaultRoom = 'school';
      var rooms = ['school' , 'classroom' , 'classroom-group' , 'staff-teachers'];

      //Emit the rooms array
      socket.emit('setup', {
        rooms: rooms
      });

      //Listens for new user
      socket.on('new user', function(data) {
        data.room = defaultRoom;
        //New user joins the default room
        socket.join(defaultRoom);
        //Tell all those in the room that a new user joined
        io.in(defaultRoom).emit('user joined', data);
      });

      //Listens for switch room
      socket.on('switch room', function(data) {
        //Handles joining and leaving rooms
        //console.log(data);
        socket.leave(data.oldRoom);
        socket.join(data.newRoom);
        io.in(data.oldRoom).emit('user left', data);
        io.in(data.newRoom).emit('user joined', data);

      });

      //Listens for a new chat message
      socket.on('new message', function(data) {
        //Create message
        var newMsg = new comment({
          username: data.username,
          type: "string",
          description: data.message,
          room: data.room.toLowerCase(),      
          ownerId: req.body.username,
          groupId: ""
        });
        //Save it to database
        newMsg.save(function(err, msg){
          //Send message to those connected in the room
          io.in(msg.room).emit('message created', msg);
        });
      });

};