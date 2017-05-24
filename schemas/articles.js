/**
 * Created by yanqi on 2017/4/6.
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  a_title: String,
  a_abs: String,
  a_tag:	[{ type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag' }],
  p_id:[{ type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' }],
  content: String,
  addTime: {
    type: Date,
    default: new Date()
  },
  a_pic: String,
  author: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  }
});