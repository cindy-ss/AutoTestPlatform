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
	sum ++;
	num.cap ++;
	num.bottle ++;
};

while(getV() > 0 && num.coin >= 0){
	if(num.cap > cap){
		num.cap -= cap;
		console.log('cap change 1');
		drink();
	}else{
		if(num.bottle > bottle){
			num.bottle -= bottle;
			console.log('bottle change 1');
			drink();
		}else{
			if(num.coin > coin){
				num.coin -= coin;
				console.log('buy 1');
				drink();
			}else{
				num.cap ++;
				num.bottle ++;
				num.coin -= 2;
				console.log('borrow 1');
			}
		}
	}
	console.log(`coin: ${num.coin}, cap: ${num.cap}, bottle: ${num.bottle}, sum: ${sum}`);
}
console.log(sum);
console.log(`coin: ${num.coin}, cap: ${num.cap}, bottle: ${num.bottle}, sum: ${sum}`);