/**
 * Created by yanqi on 2017/5/1.
 */
var mongoose = require('mongoose');
var orderSchema = require('../schemas/orders');

module.exports = mongoose.model('Order', orderSchema);