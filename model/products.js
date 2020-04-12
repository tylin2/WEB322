const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
  Name:{
      type:String,
      required:true
  },
  Price:{
    type:mongoose.Decimal128,
    required:true
  },
  Category:{
    type:String,
    required:true
  },
  BestSeller:{
    type:Boolean,
    default:false,
    required:true
  },
  ReleasedDate:{
    type:Date,
    required:true
  },
  Players:{
    type:Number,
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
  description:{
    type:String,
    required:true
  },
  Quantity:{
    type:Number,
    required:true
  }
});

const productModel = mongoose.model('products', productSchema);
module.exports = productModel;