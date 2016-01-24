var express = require('express');
var querystring = require('querystring');
var http = require('http');
var app = express();

var start = function(){
    app.use('/',function(req1, res1){
        var jsonp = req1.param("jsonpcallback");
        var obj = {
            "openid" : "",
            "area" : "",
            "openkey" : "",
            "serviceName" : "",
            "param" : "",
            "timeout" : "6000"
        };
        obj.openid = req1.param("openid") || "";
        obj.openkey = req1.param("openkey") || "";
        obj.serviceName = req1.param("serviceName") || "";
        obj.param = req1.param("param") || "";

        console.log(obj);

        var postData = querystring.stringify(obj);
        console.log("ffffff" + postData);

        var options = {
            hostname: '10.225.8.214',
            port: 9081,
            path: '/mp/rest/rout/invokeWebServiceWithXml',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        var req = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            var body = "";
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function() {
                body = body.substring(13, body.length);
                console.log('body : ' + jsonp +  body);
                res1.writeHead(200, {
                    "Content-Type" : "text/html;charset=utf-8"
                });
                res1.end(jsonp + body, "utf8");
            })
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            res1.end("");
        });

// write data to request body
        req.write(postData);
        req.end();
    });

    app.set('port', (process.env.PORT || 8888));

    app.listen(app.get('port'), function() {
        console.log("Node app is running on port:" + app.get('port'))
    });
};

start();