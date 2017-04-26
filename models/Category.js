/**
 * Created by yanqi on 2017/4/7.
 */
var mongoose = require('mongoose');
var categorySchema = require('../schemas/categories');

module.exports = mongoose.model('Category', categorySchema);