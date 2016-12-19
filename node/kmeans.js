//import kMeans from 'talisman/clustering/k-means';
//const talisman = require('talisman');
//const kMeans = talisman.cluster.kMeans();

const kMeans = require('../node_modules/talisman/clustering/k-means').default;

//console.log(kMeans);

const options = {
	k : 2
};

const data = [[1,2],
	[2,1],
	[10,11],
	[12,13]];

const clusters = kMeans(options, data);

console.log(clusters);