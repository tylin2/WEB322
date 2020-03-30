const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  fullName:{
      type:String,
      required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  dateCreate:{
      type:Date,
      default:Date.now()      
  }

});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;