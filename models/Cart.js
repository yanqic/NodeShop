/**
 * Created by yanqi on 2017/4/23.
 */
var mongoose = require('mongoose');
var cartSchema = require('../schemas/carts');

module.exports = mongoose.model('Cart', cartSchema);