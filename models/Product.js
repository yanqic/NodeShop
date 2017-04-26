/**
 * Created by yanqi on 2017/4/6.
 */
var mongoose = require('mongoose');
var productSchema = require('../schemas/products');

module.exports = mongoose.model('Product', productSchema);