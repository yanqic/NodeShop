var express = require("express");
var swig = require("swig");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var session = require('express-session');

var app = express();

app.use( bodyParser.urlencoded({extended: true}) );
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use('/public',express.static(__dirname+'/public'));

app.engine('html', swig.renderFile);
app.set("view engine", 'html');
app.set('views', __dirname + '/views');

swig.setDefaults({cache: false});

app.use('/admin', require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/MaleShop', function(err){
	if(err){
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功');
		app.listen(2000);
	}
}) 