var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Tag = require('../models/Tag');
var Product = require('../models/Product');
var Article = require('../models/Article');
var User = require('../models/User');
var Order = require('../models/Order');

var data;
router.use(function (req, res, next) {
  data = {
    adminInfo: req.session.adminInfo,
    categories: [],
    tags:[]
  }
  if(!data.adminInfo){
    res.render('admin/login');
    return;
  }
  next();
});

router.get('/', function (req, res) {
    res.render('admin/index',data);
});
//添加用户界面
router.get('/add_user',function (req,res) {
  res.render('admin/add_user');
})
//后台登陆
router.get('/login',function(req,res){
  res.render('admin/login');
});
//后台商品列表页
router.get('/product',function(req,res){
  data.status = req.query.status || '';
  var p_id =req.query.p_id||'';
  var p_title = req.query.p_title||'';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 6;
  data.pages = 0;
  var where ={};
  if (data.status) {
    where.status = data.status;
  }
  if(p_id){
    where.p_id=p_id;
  }
  if(p_title){
    where.p_title=new RegExp(p_title);
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
//编辑商品界面
router.get('/up_pro',function(req,res){
  Tag.find().then(function (tags) {
    data.tags=tags;
    Category.find().then(function (cates) {
      data.cates=cates;
      Product.findOne({_id:req.query._id}).then(function (proInfo) {
        data.product=proInfo;
        // data.product.color=data.product.color
        res.render('admin/up_pro',data);
      })
    })
  })
})
//进入add_art页面
router.get('/add_art', function (req, res) {
  Tag.find().then(function(tags) {
    data.tags = tags;
    res.render('admin/add_article',data);
  })
})
//文章列表页
router.get('/article',function (req,res) {
  data.status = req.query.status || '';
  var author=req.query.author||'';
  var a_title = req.query.a_title||'';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 6;
  data.pages = 0;
  var where ={};
  if (data.status) {
    where.status = data.status;
  }
  if(author){
    User.findOne({uname:author}).then(function (resUser) {
        where.author=resUser._id||'';
        return;
    })
  }
  if(a_title){
    where.a_title=new RegExp(a_title);
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
//文章修改页面
router.get('/up_art',function (req,res) {
  Tag.find().then(function(tags) {
    data.tags = tags;
    Article.findOne({_id:req.query._id}).then(function (proInfo) {
      data.article=proInfo;
      res.render('admin/up_art',data);
    })
  })
})
  //用户列表
router.get('/user',function (req,res) {
  data.status = req.query.status || '';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 6;
  data.pages = 0;
  var where ={};
  if (data.status) {
    where.status = data.status;
  }
  User.where(where).count().then(function (count) {
    data.count = count;
    //计算总页数
    data.pages = Math.ceil(data.count / data.limit);
    //取值不能超过pages
    data.page = Math.min(data.page, data.pages);
    //取值不能小于1
    data.page = Math.max(data.page, 1);

    var skip = (data.page - 1) * data.limit;
    return User.where(where).find().limit(data.limit).skip(skip);
  }).then(function (uInfo) {
    data.users = uInfo;
    res.render('admin/user',data);
  })
})
router.get('/tag',function (req,res) {
  Tag.find().then(function (tags) {
    data.tags=tags;
    res.render('admin/tag',data);
  })
})
router.get('/cate',function (req,res) {
  Category.find().then(function (cates) {
    data.categories=cates;
    res.render('admin/category',data);
  })
})
//订单中心
router.get('/order',function (req,res) {
  data.status = req.query.status || '';
  data.count = 0;
  data.page = Number(req.query.page || 1);
  data.limit = 5;
  data.pages = 0;
  var where ={};
  if (data.status==1) {
    where.status = {$in:['待发货','发货中','交易成功']};
  }else if(data.status==2){
    where.status = {$in:['申请退货','退货中','交易关闭']};
  }
  Order.where(where).count().then(function(count) {
    data.count = count;
    //计算总页数
    data.pages = Math.ceil(data.count / data.limit);
    //取值不能超过pages
    data.page = Math.min( data.page, data.pages );
    //取值不能小于1
    data.page = Math.max( data.page, 1 );

    var skip = (data.page - 1) * data.limit;
    return Order.where(where).find().limit(data.limit).skip(skip).populate({
      path: 'o_id',model:'Cart',populate:{
        path:'cp_id',model:'Product'
      }
    }).populate('u_id','uname');
  }).then(function (oInfo) {
    data.uorders = oInfo;
    res.render('admin/order',data);
  })
})
//test页面
router.get('/test',function(req,res){
  res.render('admin/test');
})

module.exports = router;