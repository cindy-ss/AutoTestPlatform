var apiai = require("apiai");

var app = apiai("0091c68b617d4606bc7688c337f0740b", "fff");

var request = app.textRequest("hello");

request.on("response", function(data){
    console.log(data);
});

request.on("error", function(error){
    console.log(error);
});

request.end();