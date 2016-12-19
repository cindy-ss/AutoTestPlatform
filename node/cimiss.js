'use strict';

let cheerio = require('cheerio'),
	fs = require('fs');

fs.readFile('./test/web.data', 'utf-8', (err, data) => {
	var $ = cheerio.load(data);

	const li = $("#treeMenu1").find('li');
	let arr = [];

	li.each((i, ele) => {
		if(parseInt(i) / 2 == 0){
			//console.log();
			arr.push($(ele).children().last().html())
		}
	});
	console.log(arr);
});