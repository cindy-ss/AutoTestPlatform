/**
 * Created by Edel on 16/1/25.
 */
var http = require("http");
var request = require("request");
var querystring = require('querystring');

var server = http.createServer(function (req, res) {
    //if(req.url == "/" && req.method == "POST"){
    var temp = "";
    req.on('data', function (chunk) {
        temp += chunk;
    });

    req.on('end', function () {
        console.log("Data" + temp);
        if(temp){
            var data = eval("(" + temp + ")");
        }
        var options = temp ? {
            url:'http://10.225.8.187:9081/mp/rest/rout/invokeWebServiceWithXml',
            form: {
                "openid" : data.openid,
                "area" : "",
                "openkey" : data.openkey,
                "serviceName" : data.serviceName,
                "param" : JSON.stringify(data.param),
                "timeout" : "6000"
            }
        } : {
            url : "http://10.225.8.187:9081/mp/rest/rout/invokeWebServiceWithXml",
            form : {
                "openid" : "",
                "area" : "",
                "openkey" : "",
                "serviceName" : "",
                "param" : "",
                "timeout" : "6000"
            }
        };

        request.post(options, function(err,httpResponse,body){
            res.writeHead(200, {
                "Content-Type": "text/html; charset=UTF-8",
                "Access-Control-Allow-Origin": '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            if(err){
                res.end(err);
            }
            else{
                res.end(body);
            }
        });
    });

});

server.listen(process.env.PORT || 8888);
console.log("Server started on", process.env.PORT || 8888);