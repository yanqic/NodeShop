/**
 * Created by yanqi on 2017/3/31.
 */
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  p_title: String,
  p_id: Number,
  p_size:	{
    type: Array,
    default: []
  },
  p_material:String,
  p_tag:	{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  },
  color:	{
    type: Array,
    default: []
  },
  price:	Number,
  p_num:	Number,
  p_pic:	{
    type: Array,
    default: []
  },
  p_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  p_des:	String,
  status:	Number,
  p_views:{
    type: Number,
    default: 0
  }
});