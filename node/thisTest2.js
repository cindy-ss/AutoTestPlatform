"use strict";

const parent = () => {
	return {
		'age': {value: '111'},
		'name': {value: 'test'},
		setName(name){
			this.name = name;
		}
	}
};

const factory = (type, protoFunc) => {
	const arr = {
		aaa(){
			if(protoFunc){
				protoFunc.call(this);
			}
			const temp = parent();
			return temp;
		}
	};
	return arr[type] ? arr[type](protoFunc) : {}
};

let a = factory('aaa');
let b = factory('aaa', a);
a.setName('fuck');
b.setName('fuck2');
console.log(a.name);
console.log(b.name);