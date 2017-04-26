var crypto = require("crypto");

module.exports=function(pass){
	var md5=crypto.createHash("md5");
	var password=md5.update(pass).digest("base64");
	return password;
}