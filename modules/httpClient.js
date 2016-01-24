/**
 * Created by Edel on 15/10/28.
 */
var http = require("http");
var url = require("url");

var start = function(route){
    var requestCallBack = function(request, response){
        var pathName = url.parse(request.url).pathname;
        console.log("Request from " + pathName + " received");
        route(pathName);
        response.writeHead(200, {"Content-Type" : "text/plain"});
        response.write("Hello World");
        response.end();
    };

    http.createServer(requestCallBack).listen(8888);
    console.log("Server running on 8888");
};

exports.start = start;