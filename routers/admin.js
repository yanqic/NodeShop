var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Tag = require('../models/Tag');
var Product = require('../models/Product');
var Article = require('../models/Article');

var data;
router.use(function (req, res, next) {
  data = {
    adminInfo: req.session.adminInfo,
    categories: [],
    tags:[]
  }

  Tag.find().then(function(tags) {
    data.tags = tags;
  });

  next();
});

router.get('/', function (req, res) {
  if(data.adminInfo){
    res.render('admin/index',data);
  }else{
    res.render('admin/login');
  }

});
//添加用户界面
router.get('/add_user',function (req,res) {
  res.render('admin/add_user');
})
//后台登陆
router.get('/login',function(req,res){
  res.render('admin/login');
});
//进入edit页面
router.get('/edit', function (req, res) {
  Tag.find().then(function(tags) {
    data.tags = tags;
    res.render('admin/add_article',data);
  })
})
//后台商品列表页
router.get('/product',function(req,res){
  data.status = req.query.status || '';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 6;
  data.pages = 0;
  var where ={};
  if (data.status) {
    where.status = data.status;
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
    return Product.where(where).find().limit(data.limit).skip(skip);
  }).then(function (proInfo) {
    data.products = proInfo;
    res.render('admin/product',data);
  })

})
//添加商品界面
router.get('/add_product',function (req,res) {
  Tag.find().then(function (tags) {
    data.tags=tags;
    Category.find().then(function (cates) {
      data.cates=cates;
      res.render('admin/add_product',data);
    })
  })
})
//文章列表页
router.get('/article',function (req,res) {
  data.status = req.query.status || '';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 6;
  data.pages = 0;
  var where ={};
  if (data.status) {
    where.status = data.status;
  }
  Article.where(where).count().then(function(count) {
    data.count = count;
    //计算总页数
    data.pages = Math.ceil(data.count / data.limit);
    //取值不能超过pages
    data.page = Math.min(data.page, data.pages);
    //取值不能小于1
    data.page = Math.max(data.page, 1);

    var skip = (data.page - 1) * data.limit;
    return Article.where(where).find().limit(data.limit).skip(skip).populate(['a_tag','author']);
  }).then(function (addaInfo) {
    data.articles = addaInfo;
    res.render('admin/article',data);
  })
})


//test页面
router.get('/test',function(req,res){
  res.render('admin/test');
})

module.exports = router;