"use strict";

const coin = 2,
	cap = 4,
	bottle = 2;

let sum = 0,
	val = 10,
	num = {
		cap : 0,
		bottle : 0,
		coin : 10
	},
	isBorrow = false;

const getV = () => {
	return num.coin / coin + num.bottle / bottle + num.cap / cap;
};

const drink = () => {
	if(isBorrow){
		num.coin += 2;
		if(num.coin >= 0){
			isBorrow = false;
		}
	}else{
		sum ++;
		num.cap ++;
		num.bottle ++;
	}

};

const buy = () => {
	num.coin -= coin;
	console.log('buy 1');
	drink();
};

const capChange = () => {
	num.cap -= cap;
	console.log('cap change 1');
	drink();
};

const bottleChange = () => {
	num.bottle -= bottle;
	console.log('bottle change 1');
	drink();
};

const borrow = () => {
	num.cap ++;
	num.bottle ++;
	num.coin -= coin;
	//if(getV() >= 0){
		sum ++;
		console.log('borrow 1');
		isBorrow = true;
	//}else{
	//	num.cap --;
	//	num.bottle --;
	//	num.coin += coin;
	//}
};

while(num.coin >= coin){
	buy();
	console.log(`coin: ${num.coin}, cap: ${num.cap}, bottle: ${num.bottle}, sum: ${sum}`);
}

while(getV() >= 0){
	if(num.cap >= cap){
		capChange();
	}else{
		if(num.bottle >= bottle){
			bottleChange();
		}else{
			borrow();
		}
	}
	console.log(`coin: ${num.coin}, cap: ${num.cap}, bottle: ${num.bottle}, sum: ${sum}`);
}
console.log(sum);
console.log(`coin: ${num.coin}, cap: ${num.cap}, bottle: ${num.bottle}, sum: ${sum}`);