var fs = require("fs");
var unzip = require("unzip");
var path = require('path');

fs.createReadStream('../data/mwt.zip')
    .pipe(unzip.Extract({ path: '../data/mwt' }))
    .on("close", function () {
        console.log("true");
    });

//console.log("fake");
