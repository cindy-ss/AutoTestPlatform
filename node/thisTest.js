"use strict";

function _axiba(){
	var ctx = this
	ctx.age = 111
	ctx.setName = function(name){
		//ctx.name = name
		ctx.age ++;
	}
	return this;
}




function manager(){
	var funs = {
		aaa: function (param){
			let obj = new _axiba();
			obj.name = 'fk';
			for(var key in param) {
				obj[key] = param[key];
			}
			//obj.setName = name => {
			//	obj.name = name;
			//}
			obj.getName = function(){
				return this.name
			};
			//console.log(obj);
			return obj;
		}
	}
	this.new = function(type,params){
		return new funs[type](params)
	}
}



var ma = new manager();
var a = ma.new("aaa");
a.age = "333";
var b = ma.new("aaa",a)
a.setName("A的姓名")
b.setName("B的姓名")
//console.log(a,b)
console.log(a.age);
console.log(b.age);