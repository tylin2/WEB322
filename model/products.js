const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
  Name:{
      type:String,
      required:true
  },
  Price:{
    type:number,
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
  /*img:{
    type:String,
    required:true
  },*/
  dateCreate:{
    type:Date,
    default:Date.now()      
  }
  //createBy:{ }
});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;