/**
 * Created by yanqi on 2017/4/23.
 */
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  cp_id:	{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  color:String,
  num:Number,
  size:String,
  u_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  addTime:{
    type: Date,
    default: new Date()
  },
  status:{
    type: Boolean,
    default: false
  }
});