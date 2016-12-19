"use strict";

var Canvas = require('canvas')
	, Image = Canvas.Image;
var hog = require("hog-descriptor");
const fs = require('fs'),
	async = require('async'),
	path = require('path');
var svm = require("svm");
const kmeans = require('node-kmeans');

const dir = '/Users/Edel/test/data/image/';

let nameArr = [], hogArr = [], res = [];

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

		const descriptor = hog.extractHOG(canvas, options);

		nameArr.push(name);
		hogArr.push(descriptor);
	}
	catch (e){
		console.log(name + ' error');
	}
};

exports.getFileHog = getFileHog;

//let cates = fs.readdirSync(dir);
//cates.forEach((cate) => {
//	if (cate.charAt(0) == '.') {
//		return;
//	}
//	let files = fs.readdirSync(dir + cate);
//	files.forEach((file) => {
//		if (file.charAt(0) == '.') {
//			return;
//		}
//		getFileHog(dir + cate + '/' + file);
//	});
//});

function mvPic(from, to){
	fs.writeFileSync(to, fs.readFileSync(from));
}

const tmpDir = '/Users/Edel/test/data/un/pre/';
const tmpDir2 = '/Users/Edel/test/data/un/after/';
let files = fs.readdirSync(tmpDir);
files.forEach((file) => {
	if (file.charAt(0) == '.') {
		return;
	}
	getFileHog(tmpDir + file);
});

console.log("==========calculating=================");

kmeans.clusterize(hogArr, {k: 20}, (err,res) => {
	if (err) console.error(err);
	console.log("===============File moving=============");
	res.forEach((item, index) => {
		let tempArr = [];

		if(!fs.existsSync(tmpDir2 + index + '/')){
			fs.mkdirSync(tmpDir2 + index + '/');
		}

		item.cluster.forEach((des) => {
			const tmp = nameArr[hogArr.indexOf(des)];
			mvPic(tmp, tmpDir2 + index + '/' + path.basename(tmp));
		});
	});
});