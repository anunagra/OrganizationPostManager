// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');

var commentsSchema = new mongoose.Schema({
    id : String,
    type : String,
    description :String,
    ownerId : String,
    groupId : String,
    ownerType : String,
    room : String,
    created_at: Date,
    updated_at: Date
});


commentsSchema.pre('save', function(next) {
  
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
var comment =  mongoose.model('comment', commentsSchema);

module.exports = comment;