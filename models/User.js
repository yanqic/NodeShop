/**
 * Created by yanqi on 2017/3/27.
 */
var mongoose = require('mongoose');
var userSchema = require('../schemas/users');

module.exports = mongoose.model('User',userSchema);