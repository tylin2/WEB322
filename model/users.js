const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

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
  type:{
    type:String,
    default:"User"
  },
  dateCreate:{
      type:Date,
      default:Date.now()      
  }

});

userSchema.pre("save","updateOne",function(next){
  bcrypt.genSalt(10)
  .then((salt)=>{
    bcrypt.hash(this.password,salt)
    .then((encryptPassword)=>{
      this.password=encryptPassword;
      next();
    })
    .catch(err=>console.log(`Error occured when hashing ${err}`));
  })
  .catch(err=>console.log(`Error occured when salting ${err}`));
})
const userModel = mongoose.model('users', userSchema);

module.exports = userModel;