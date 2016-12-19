"use strict";

var Canvas = require('canvas')
	, Image = Canvas.Image;
var hog = require("hog-descriptor");
const fs = require('fs'),
	async = require('async');
var svm = require("svm");


const dir = '/Users/Edel/test/data/image/',
	sub = ['toilet/', 'ass/'];

const options = {
	cellSize: 16,    // length of cell in px
	blockSize: 2,   // length of block in number of cells
	blockStride: 1, // number of cells to slide block window by (block overlap)
	bins: 9,        // bins per histogram
	norm: 'L2'      // block normalization method
};

let arr = [], dataSet = [], label = [];

//sub.forEach( (item) => {
//	let tmp = dir + item;
//	let files = fs.readdirSync(tmp);
//	files.forEach( (file) => {
//		console.log(dir + item + file);
//		let data = fs.readFileSync(dir + item + file, 'utf-8');
//		let canvas = new Canvas(150, 200),
//			ctx = canvas.getContext('2d');
//
//		let img = new Image;
//		img.src = data;
//		ctx.drawImage(img, 0, 0, 150, 200);
//
//		var descriptor = hog.extractHOG(canvas, options);
//
//		console.log(item + '  ' + descriptor.length);
//		dataSet.push(descriptor);
//
//		const tmp = item.split('/')[0] == 'M'? -1 : 1;
//		console.log(tmp);
//		label.push(tmp);
//	});
//});
//
//let SVM = new svm.SVM();
//SVM.train(dataSet, label);
//
//fs.readFile(dir + 'under/0.jpg', (err, data) => {
//	if (err) callback(err);
//	let canvas = new Canvas(150, 200),
//		ctx = canvas.getContext('2d');
//
//	let img = new Image;
//	img.src = data;
//	ctx.drawImage(img, 0, 0, 150, 200);
//
//	var descriptor = hog.extractHOG(canvas, options);
//
//	console.log(8 + '  ' + descriptor.length);
//
//	console.log(SVM.predict([descriptor]));
//});

sub.forEach( (item) => {
	let files = fs.readdirSync(dir + item);
	files.forEach( (file) => {
		arr.push(item +file);
	});
});

//console.log(arr);

async.each(arr, (item, callback) => {
	fs.readFile(dir + item, (err, data) => {
		if (err) callback(err);
		let canvas = new Canvas(75, 100),
			ctx = canvas.getContext('2d');

		let img = new Image;
		img.src = data;
		ctx.drawImage(img, 0, 0, 75, 100);

		var descriptor = hog.extractHOG(canvas, options);

		console.log(item + '  ' + descriptor.length);
		dataSet.push(descriptor);

		const tmp = item.split('/')[0] == 'ass'? -1 : 1;
		//console.log(tmp);
		label.push(tmp);

		callback();
	});
}, (err) => {
	if(err){
		console.log(err);
	}
	let SVM = new svm.SVM();
	SVM.train(dataSet, label, { kernel: 'rbf', rbfsigma: 0.5 });

	fs.readFile(dir + 'ass/1.jpg', (err, data) => {
		if (err) callback(err);
		let canvas = new Canvas(75, 100),
			ctx = canvas.getContext('2d');

		let img = new Image;
		img.src = data;
		ctx.drawImage(img, 0, 0, 75, 100);

		var descriptor = hog.extractHOG(canvas, options);

		console.log(8 + '  ' + descriptor.length);

		console.log(SVM.predict([descriptor]));
	});
});