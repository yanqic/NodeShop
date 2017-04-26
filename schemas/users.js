/**
 * Created by yanqi on 2017/3/27.
 */
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
   uname: String,
   password: String,
  //是否是管理员
  type: {
    type: Number,
    default: 0
  }
});