/**
 * Created by yanqi on 2017/4/7.
 */
var mongoose = require('mongoose');
var tagSchema = require('../schemas/tags');

module.exports = mongoose.model('Tag', tagSchema);