var kmeans = require('dimas-kmeans')

var data = [
	[1,2],
	[2,1],
	[10,11],
	[12,13]
];

var clusters = kmeans.getClusters(data);

clusters.forEach((c) => {
	c.data.forEach((item) => {
		console.log(item);
	})
});