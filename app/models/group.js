// grab the mongoose module
var mongoose = require('mongoose');

var user = require('./user');

var groupSchema = new mongoose.Schema({
    groupId : String,
    groupName :{ type: String, required: true, unique: true },
    groupAdmin : { type: String, required: true },
    groupMembers : Array ,
    created_at: Date,
    updated_at: Date
});

groupSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();  
  // change the updated_at field to current date
  this.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.created_at){
    this.created_at = currentDate;
  }
  next();
});

// module.exports allows us to pass this to other files when it is called
var group = mongoose.model('group', groupSchema );

module.exports = group;