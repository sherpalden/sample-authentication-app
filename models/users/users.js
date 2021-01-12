//Require Mongoose
const mongoose = require('mongoose');
//Define a schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
  	type: String,
  	required: true,
    unique: true,
  },
  password: {
  	type: String,
  },
  isVerified: {
    type: Boolean, default: false
  }
});

const Users = mongoose.model('User', UserSchema );
module.exports = Users;