// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    firstName : String,
    lastName :String,
    userName : { type: String, required: true, unique: true },
    type : String,
    password : { type: String, required: true },
    created_at: Date,
    updated_at: Date
});

userSchema.pre('save', function(next) {
  
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
var user = mongoose.model('user', userSchema );

module.exports = user;