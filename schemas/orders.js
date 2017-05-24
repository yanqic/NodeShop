/**
 * Created by yanqi on 2017/4/25.
 */
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

  o_id:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }],
  u_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sum:Number,
  uname:String,
  phone: String,
  address:String,
  note:String,
  addTime:{
    type: Date,
    default: new Date()
  },
  status:{
    type: String,
    default: '待发货'
  }
});