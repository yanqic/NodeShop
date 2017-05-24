var express = require('express');
var router = express.Router();
var md5 = require("../models/md5.js");

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var User = require('../models/User');
var Category = require('../models/Category');
var Tag = require('../models/Tag');
var Product = require('../models/Product');
var Article = require('../models/Article');
var Cart = require('../models/Cart');

var resData;
router.use(function (req,res,next) {
  resData = {
    code: 0,
    mess: ''
  }
  next();
})
router.post('/register',function (req,res) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  var type = req.body.type||0;
  if(username==''){
    resData.code = 1;
    resData.mess = '用户名不能为空';
    res.json(resData);
    return;
  }
  if(password==''||password!==repassword){
    resData.code = 2;
    resData.mess = '密码错误';
    res.json(resData);
    return;
  }
  User.findOne({uname:username}).then(function(userInfo){
    if(userInfo){
      resData.code = 3;
      resData.mess = '用户名已存在';
      res.json(resData);
      return;
    }else{
      var pass=md5(md5(password).substr(5,8)+password);
      var user = new User({
        uname:username,
        password:pass,
        type:type
      });
      return user.save();
    }
  }).then(function(userReg){
    resData.mess='注册成功';
    res.json(resData);
  })


})
//管理员登陆
router.post('/admin/login',function(req,res){
  var uname = req.body.username;
  var password = req.body.password;
  if(uname==''||password==''){
    resData.code=1;
    resData.mess='用户名和密码不能为空';
    res.json(resData);
    return;
  }
  var pass=md5(md5(password).substr(5,8)+password);
  User.findOne({uname:uname,password:pass}).then(function(adminInfo){
    if(!adminInfo){
      resData.code=2;
      resData.mess='用户名或密码错误';
      res.json(resData);
      return;
    }else if(adminInfo.type==0){
      resData.code=3;
      resData.mess='非管理员账号';
      res.json(resData);
      return;
    }
    resData.mess='登陆成功';
    resData.adminInfo = {
      _id: adminInfo._id,
      uname: adminInfo.uname,
      type: adminInfo.type
    }
    req.session.adminInfo = resData.adminInfo;
    res.json(resData);
    return;
  })
})
//用户登陆
router.post('/user/login',function(req,res){
  var uname = req.body.username;
  var password = req.body.password;
  if(uname==''||password==''){
    resData.code=1;
    resData.mess='用户名和密码不能为空';
    res.json(resData);
    return;
  }
  var pass=md5(md5(password).substr(5,8)+password);
  User.findOne({uname:uname,password:pass}).then(function(userInfo){
    if(!userInfo){
      resData.code=2;
      resData.mess='用户名或密码错误';
      res.json(resData);
      return;
    }
    resData.mess='登陆成功,1S后跳转主页';
    resData.userInfo = {
      _id: userInfo._id,
      uname: userInfo.uname
    }
    req.session.userInfo = resData.userInfo;
    res.json(resData);
    return;
  })
})
router.get('/a_logout',function(req,res){
  delete req.session.adminInfo;
  res.render('admin/login');
})
//用户退出
router.get('/u_logout',function(req,res){
  delete req.session.userInfo;
  res.json(resData);
})


//图片路由处理
router.post('/uploadimg', function (req, res) {
  var ptype =req.query.type;
  if(ptype=='article'){
    // 文件将要上传到哪个文件夹下面
    var uploadfoldername = '/upload/article/';
  }else if(ptype=='product'){
    // 产品文件将要上传到哪个文件夹下面
    var uploadfoldername = '/upload/product/';
  }

  var uploadfolderpath = path.join('./public', uploadfoldername);
  var form = new formidable.IncomingForm();
  form.uploadDir = "./temp";
  form.parse(req, function (err, fields, files) {
    if (err) {
      return console.log('formidable, form.parse err');
    }

    console.log('formidable, form.parse ok');

    // 显示参数，例如 token
    console.log('显示上传时的参数 begin');
    console.log(fields);
    console.log('显示上传时的参数 end');

    var item;

    // 计算 files 长度
    var length = 0;
    for (item in files) {
      length++;
    }
    if (length === 0) {
      console.log('files no data');
      return;
    }
    for (item in files) {
      var file = files[item];
      // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
      var tempfilepath = file.path;
      // 获取文件类型
      var type = file.type;
      // 获取文件名，并根据文件名获取扩展名
      var filename = file.name;
      var extname = filename.lastIndexOf('.') >= 0
        ? filename.slice(filename.lastIndexOf('.') - filename.length)
        : '';
      // 文件名没有扩展名时候，则从文件类型中取扩展名
      if (extname === '' && type.indexOf('/') >= 0) {
        extname = '.' + type.split('/')[1];
      }
      // 将文件名重新赋值为一个随机数（避免文件重名）
      filename = Math.random().toString().slice(2) + extname;
      // 构建将要存储的文件的路径
      var filenewpath = path.join(uploadfolderpath, filename);
      // 将临时文件保存为正式的文件
      console.log(filenewpath);
      fs.rename(tempfilepath, filenewpath, function (err) {
        // 存储结果
        var result = '';

        if (err) {
          // 发生错误
          console.log('fs.rename err');
          result = 'error|save error';
        } else {
          // 保存成功
          console.log('fs.rename done');
          // 拼接图片url地址 'http://' + server + ':' + port +
          result = '/public' + uploadfoldername + filename;
        }

        // 返回结果
        res.writeHead(200, {
          'Content-type': 'text/html'
        });
        res.end(result);
      }); // fs.rename
    } // for in
  });

})
//上传标签
router.post('/add_tag',function(req,res){
  var  tag = req.body.tag;
  Tag.findOne({name:tag}).then(function (tagInfo) {
    if(tagInfo){
      resData.code=3;
      resData.mess='该标签已存在';
      res.json(resData);
      return;
    }else{
      var mytag = new Tag({'name':tag});
      return mytag.save();
      // return mytag.get('id');
    }
  }).then(function (addMsg) {
    resData.mess='添加标签成功';
    resData.detail = addMsg;
    res.json(resData);
  })
})
//删除标签
router.get('/del_tag',function(req,res){
  var t_id = req.query.t_id;
  Tag.remove({_id:t_id}).then(function () {
    resData.mess='删除标签成功';
    res.redirect('back');
  })
})
//更新标签
router.post('/update_tag',function (req,res) {
  var t_id =req.body.t_id;
  var name = req.body.tagname;
  Tag.update({_id:t_id},{name:name}).then(function () {
    resData.mess='标签修改成功！';
    res.json(resData);
  })
})
//关联产品
router.post('/check_pid',function (req,res) {
  var p_id = req.body.p_id;
  Product.find({p_id:{$in:p_id}}).then(function(pInfo){
    if(pInfo.length==0){
      resData.code=3;
      resData.mess='该ID不存在';
      res.json(resData);
    }else{
      resData.detail= pInfo;
      resData.mess='';
      res.json(resData);
    }
  })
})
//上传类目
router.post('/add_cate',function(req,res){
  var  cate = req.body.category;
  Category.findOne({name:cate}).then(function (cateInfo) {
    if(cateInfo){
      resData.code=3;
      resData.mess='该类目已存在';
      res.json(resData);
      return;
    }else{
      var category = new Category({'name':cate});
      return category.save();
    }
  }).then(function (addMsg) {
    resData.mess='添加类目成功';
    resData.detail = addMsg;
    res.json(resData);
  })
})
//删除类目
router.get('/del_cate',function(req,res){
  var c_id = req.query.c_id;
  Category.remove({_id:c_id}).then(function () {
    resData.mess='删除类目成功';
    res.redirect('back');
  })
})
//更新类目
router.post('/update_cate',function (req,res) {
  var c_id =req.body.c_id;
  var name = req.body.catename;
  Category.update({_id:c_id},{name:name}).then(function () {
    resData.mess='类目更新成功！';
    res.json(resData);
  })
})

//上传商品
router.post('/add_product',function (req,res) {
  var p_title=req.body.p_title,p_material=req.body.p_material,p_tag=req.body.p_tag,p_size=req.body.p_size,color=req.body.color,price=req.body.price,p_num=req.body.p_num,p_pic=req.body.p_pic,p_category=req.body.p_category,p_des=req.body.p_des,status=req.body.status;
  var p_id =req.body.p_id;
  Product.findOne({p_id:p_id}).then(function (proInfo) {
    if(proInfo){
      resData.code=3;
      resData.mess='该编码已存在';
      res.json(resData);
      return;
    }else{
      var product = new Product({'p_title':p_title,'p_id':p_id,'p_material':p_material,'p_tag':p_tag,'p_size':p_size,'color':color,'price':price,'p_num':p_num,'p_pic':p_pic,'p_category':p_category,'p_des':p_des,'status':status});
     return product.save();
    }
  }).then(function (apMess) {
    resData.mess='添加产品成功';
    res.json(resData);
  })
})
//更新商品
router.post('/up_pro',function (req,res) {
  Product.update({p_id:req.body.p_id},{'p_title':req.body.p_title,'p_material':req.body.p_material,'p_tag':req.body.p_tag,'p_size':req.body.p_size,'color':req.body.color,'price':req.body.price,'p_num':req.body.p_num,'p_pic':req.body.p_pic,'p_category':req.body.p_category,'p_des':req.body.p_des,'status':req.body.status}).then(function (upstInfo) {
    resData.mess='更新产品成功';
    res.json(resData);
  })
})
//删除所以商品
router.post('/del_pro',function(req,res){
  var p_ids = req.body.p_ids;
  Product.remove({p_id:{$in:p_ids}}).then(function (delpInfo) {
    resData.mess='删除商品成功';
    res.json(resData);
  })
})
//删除一个商品
router.get('/del_pro',function (req,res) {
  var p_id = parseInt(req.query.p_id);
  Product.remove({p_id:p_id}).then(function (delpInfo){
    resData.mess='删除商品成功';
    res.redirect('back');
  })
})
//上下架
router.get('/up_status',function (req,res) {
  var p_id=req.query.p_id;
  var status=req.query.status;
  Product.update({p_id:p_id},{status:status}).then(function (upstInfo) {
    res.redirect('back');
  })
})
//批量上下架
router.post('/up_status',function (req,res) {
  var p_ids=req.body.p_ids;
  var status=req.body.status;
  if(status==1){
    status=0;
  }else{
    status=1;
  }
  Product.update({p_id:{$in:p_ids}},{status:status},{multi: true}).then(function (upstInfo) {
    resData.mess='更新成功！';
    res.json(resData);
  })
})
//上传文章
router.post('/add_article',function (req,res) {
  var author = req.session.adminInfo._id;
  var article = new Article({a_title:req.body.a_title,a_abs:req.body.a_abs,a_tag:req.body.a_tag,p_id:req.body.p_id,content:req.body.content,author:author,a_pic:req.body.a_pic});
  article.save().then(function (arInfo) {
    resData.mess='添加文章成功';
    res.json(resData);
  })
})
//删除所有文章
router.post('/del_art',function(req,res){
  var _ids = req.body._ids;
  Article.remove({_id:{$in:_ids}}).then(function () {
    resData.mess='删除商品成功';
    res.json(resData);
  })
})
//删除一篇文章
router.get('/del_art',function (req,res) {
  Article.remove({_id:req.query._id}).then(function (delpInfo){
    resData.mess='删除商品成功';
    res.redirect('back');
  })
})
//添加购物车
router.post('/add_cart',function(req,res){
  var userInfo_id = req.session.userInfo._id;
  Cart.findOne({cp_id:req.body.p_id,u_id:userInfo_id,status:false}).then(function (cartInfo) {
    if(cartInfo){
      cartInfo.num++;
      cartInfo.save();
      resData.mess='商品已成功加入购物车';
      res.json(resData);
      return;
    }else{
      var cart = new Cart({cp_id:req.body.p_id,color:req.body.color,size:req.body.size,num:req.body.num,u_id:userInfo_id});
      return cart.save();
    }
  }).then(function (addMess) {
    resData.mess='商品已成功加入购物车';
    resData.c_id=addMess._id;
    res.json(resData);
  })
})
//修改购物车数量
router.post('/upcart',function(req,res){
  Cart.update({_id:req.body.id},{num:req.body.num}).then(function (ucart) {
    resData.mess='购物车商品修改成功！';
    res.json(resData);
  })
})
//删除购物车
router.post('/delcart',function(req,res){
  var ids = req.body.id;
  Cart.remove({_id:{$in:ids}}).then(function (delCart) {
    resData.mess='删除商品成功';
    res.json(resData);
  })
})
module.exports = router;