/**
 * Created by yanqi on 2017/3/27.
 */
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  uname: String,
  password: String,
  phone: Number,
  name:String,
  address: String,
  u_tag:{
    type:Array,
    default:[]
  },
  //是否是管理员
  type: {
    type: Number,
    default: 0
  }
});