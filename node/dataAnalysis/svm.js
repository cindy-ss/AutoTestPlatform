"use strict";

const fs = require('fs');
var Canvas = require('canvas'),
	Image = Canvas.Image,
	hog = require("hog-descriptor"),
	svm = require('node-svm');

const tmpDir = '/Users/Edel/test/data/un/pre/';
const tmpDir3 = '/Users/Edel/test/data/un/test/';
const tmpDir2 = '/Users/Edel/test/data/un/after/';
const baseDir = '/Users/Edel/data/image/ass/';

//let files = fs.readdirSync(tmpDir3);
let nameArr = [], hogArr = [], dataset = [];

const options = {
	cellSize: 16,    // length of cell in px
	blockSize: 2,   // length of block in number of cells
	blockStride: 1, // number of cells to slide block window by (block overlap)
	bins: 9,        // bins per histogram
	norm: 'L2'      // block normalization method
};

const getFileHog = function(name){
	try{
		const data = fs.readFileSync(name);

		let canvas = new Canvas(100, 100),
			ctx = canvas.getContext('2d');

		let img = new Image;
		img.src = data;
		ctx.drawImage(img, 0, 0, 150, 150);

		return hog.extractHOG(canvas, options);

		//nameArr.push(name);
		//hogArr.push(descriptor);
		//return descriptor;
	}
	catch (e){
		console.log(name + ' error');
		return null;
	}
};

fs.readdirSync(tmpDir3).forEach((file) => {
	if (file.charAt(0) == '.') {
		return;
	}
	const tempDes = getFileHog(tmpDir3 + file);
	dataset.push([tempDes, -1]);
});

console.log(dataset.length);
console.log(dataset[0][0].length);

fs.readdirSync(baseDir).forEach((file) => {
	if (file.charAt(0) == '.') {
		return;
	}
	const tempDes = getFileHog(baseDir + file);
	dataset.push([tempDes, 1]);
});

console.log('Start Calculating');

var clf = new svm.SVM({
	svmType : 'ONE_CLASS',
	//kernelType : 'LINEAR'
});

clf.train(dataset).done(function () {
	// predict things
	dataset.forEach(function(ex, index){
		var prediction = clf.predictSync(ex[0]);
		console.log(`${index} : ${prediction}`);
	});
});