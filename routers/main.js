var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Article = require('../models/Article');
var Tag = require('../models/Tag');
var Product = require('../models/Product');
var Cart = require('../models/Cart');
var Order = require('../models/Order');
var User = require('../models/User');

var data;
router.use(function(req,res,next){
  data = {
    userInfo: req.session.userInfo,
    categories: []
  }

  Category.find().then(function(categories) {
    data.categories = categories;
    Tag.find().then(function (tags) {
      data.tags = tags;
      next();
    })
  });
})

router.get('/',function(req,res){
  data.tag = req.query.tag || '';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 4;
  data.pages = 0;
  var where ={};
  if (data.tag) {
    where.tag = data.tag;
  }
  Article.where(where).count().then(function(count) {
    data.count = count;
    data.pages = Math.ceil(data.count / data.limit);
    data.page = Math.min(data.page, data.pages);
    data.page = Math.max(data.page, 1);

    var skip = (data.page - 1) * data.limit;
    return Article.where(where).find().limit(data.limit).skip(skip).populate(['author']);
  }).then(function (atInfo) {
    data.articles = atInfo;
    res.render('main/index',data);
  })
});
//article
router.get('/article',function (req,res) {
  var a_Id = req.query.a_id || '';
  Article.findOne({
    _id: a_Id
  }).populate(['p_id','author']).then(function (article) {
    data.article = article;

    article.views++;
    article.save();
    if(data.userInfo){
      User.findOne({uname:userInfo.uname}).then(function (user) {
        if(user.u_tag.indexof(article.a_tag[0])==-1){
          user.u_tag.push(article.a_tag[0]);
          user.markModified('u_tag');
          user.save();
        }
      })
    }
    res.render('main/article', data);
  });
})
//shop
router.get('/shop',function (req,res) {
  data.cate = req.query.cate|| '';
  data.sort = req.query.sort||'';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 6;
  data.pages = 0;
  var where ={},sort={};
  if (data.cate) {
    where.p_category = data.cate;
  }
  if(data.sort=='price'){
    sort.price = 1;
  }else if(data.sort=='addTime'){
    sort._id= -1;
  }
  Product.where(where).count().then(function(count) {
    data.count = count;
    //计算总页数
    data.pages = Math.ceil(data.count / data.limit);
    //取值不能超过pages
    data.page = Math.min( data.page, data.pages );
    //取值不能小于1
    data.page = Math.max( data.page, 1 );

    var skip = (data.page - 1) * data.limit;
    return Product.where(where).find().limit(data.limit).skip(skip).sort(sort);
  }).then(function (proInfo) {
    data.products = proInfo;
    res.render('main/shop',data);
  })
})
//cart列表
router.get('/cart',function (req,res) {
  var c_Id = data.userInfo._id||'';
  Cart.find({u_id:c_Id,status:false}).populate(['cp_id']).then(function (cartInfo) {
    data.carts=cartInfo;
    res.render('main/cart',data);
  })

})
//pdetail
router.get('/pdetail',function (req,res) {
  var p_Id = req.query.p_id || '';
  Product.findOne({
    _id: p_Id
  }).populate(['p_tag','p_category']).then(function (pro) {
    data.pro = pro;
    pro.views++;
    pro.save();
    res.render('main/pdetail',data);
  });
})
router.get('/order',function (req,res) {
  var ids = req.query.ids;
  Cart.find({_id:{$in:ids}}).populate(['cp_id']).then(function (cartInfo) {
    data.orders=cartInfo;
    data.orders=cartInfo;
    res.render('main/order',data);
  })
})
router.get('/pay',function (req,res) {
  var o_id =req.query.o_id;
  var order =new Order({o_id:o_id,u_id:data.userInfo._id,sum:req.query.sum,uname:req.query.uname,phone:req.query.phone,address:req.query.address,note:req.query.note});
  order.save().then(function (orMess) {
    if(orMess){
      data.payid=orMess._id;
      return Cart.update({_id:{$in:o_id}},{status:true},{multi:true}
      );
    }c
  }).then(function(upcart){
    res.render('main/pay',data);
  })

})
router.get('/user',function (req,res) {
  var c_Id = data.userInfo._id||'';
  Order.find({u_id:c_Id}).populate({
    path: 'o_id',model:'Cart',populate:{
      path:'cp_id',model:'Product'
    }
  }).then(function (userInfo) {
    data.uorders=userInfo;
    res.render('main/user',data);
  })
})
module.exports = router;