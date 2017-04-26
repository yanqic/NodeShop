/**
 * Created by yanqi on 2017/4/6.
 */
var mongoose = require('mongoose');
var articleSchema = require('../schemas/articles');

module.exports=mongoose.model('Article',articleSchema);