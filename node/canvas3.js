"use strict";

var Canvas = require('canvas')
	, Image = Canvas.Image;
var hog = require("hog-descriptor");
const fs = require('fs'),
	async = require('async');
let brain = require('brain');

var net = new brain.NeuralNetwork();

const dir = '/Users/Edel/test/data/image/',
	sub = ['M/', 'ass/'];

const options = {
	cellSize: 10,    // length of cell in px
	blockSize: 2,   // length of block in number of cells
	blockStride: 1, // number of cells to slide block window by (block overlap)
	bins: 3,        // bins per histogram
	norm: 'L2'      // block normalization method
};

let arr = [], dataSet = [], label = [];

sub.forEach( (item) => {
	for(let i = 1; i <= 6; i ++){
		arr.push(item + i + '.jpg');
	}
});

async.each(arr, (item, callback) => {
	fs.readFile(dir + item, (err, data) => {
		if (err) callback(err);
		let canvas = new Canvas(150, 200),
			ctx = canvas.getContext('2d');

		let img = new Image;
		img.src = data;
		ctx.drawImage(img, 0, 0, 150, 200);

		var descriptor = hog.extractHOG(canvas, options);

		console.log(item + '  ' + descriptor.length);

		const tmp = item.split('/')[0];
		//label.push(tmp);
		dataSet.push({
			input : descriptor,
			output : tmp == 'M'? {'M' : 1} : {ass : 1}
		});

		callback();
	});
}, (err) => {
	if(err){
		console.log(err);
	}

	net.train(dataSet);

	fs.readFile(dir + 'M/7.jpg', (err, data) => {
		if (err) callback(err);
		let canvas = new Canvas(150, 200),
			ctx = canvas.getContext('2d');

		let img = new Image;
		img.src = data;
		ctx.drawImage(img, 0, 0, 150, 200);

		var descriptor = hog.extractHOG(canvas, options);

		console.log(7 + '  ' + descriptor.length);

		let prediction = net.run(descriptor);
		console.log(prediction);
	});
});