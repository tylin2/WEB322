const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cartSchema = new Schema({
  productId:{
    type:String,
    required:true
  },
  Name:{
      type:String,
      required:true
  },
  Price:{
    type:mongoose.Decimal128,
    required:true
  },
  productPic:{
    type:String    
  },
  dateCreate:{
    type:Date,
    default:Date.now()      
  },
  createBy:{
    type:String
  },  
  Quantity:{
    type:Number,
    required:true
  },
  MAX_Quantity:{
    type:Number,
    required:true
  }
});

const cartModel = mongoose.model('carts', cartSchema);
module.exports = cartModel;