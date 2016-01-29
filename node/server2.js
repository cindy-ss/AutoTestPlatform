/**
 * Created by Edel on 16/1/25.
 */
var express = require('express');
var querystring = require('querystring');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();

var start = function(){
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use("/", function(req, res){
        console.log(req.body);
        res.writeHead(200, {
            "Content-Type": "text/html; charset=UTF-8",
            "Access-Control-Allow-Origin":'*',
            'Access-Control-Allow-Methods': 'POST GET OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end("");
    });
    //app.use('/',function(req1, res1){
    //    var temp;
    //    req1.on('data', function (chunk) {
    //        console.log("FFFFFF");
    //        if(temp == undefined){
    //            temp = chunk
    //        }
    //        else {
    //            temp += chunk;
    //        }
    //        console.log("cccc" + temp);
    //    });
    //
    //    req1.on('end', function () {
    //        console.log(temp);
    //
    //        var postData = querystring.stringify(temp);
    //        console.log("data before posting" + postData);
    //
    //        var options = {
    //            hostname: '10.225.8.214',
    //            port: 9081,
    //            path: '/mp/rest/rout/invokeWebServiceWithXml',
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/x-www-form-urlencoded',
    //                'Content-Length': postData.length
    //            }
    //        };
    //
    //        var req = http.request(options, function (res) {
    //            console.log('STATUS: ' + res.statusCode);
    //            var body = "";
    //            res.on('data', function (chunk) {
    //                body += chunk;
    //            });
    //            res.on('end', function () {
    //                body = body.substring(13, body.length);
    //                console.log('body : ' + body);
    //                res1.writeHead(200, {
    //                    "Content-Type": "text/html; charset=UTF-8",
    //                    "Access-Control-Allow-Origin":'*',
    //                    'Access-Control-Allow-Methods': 'POST',
    //                    'Access-Control-Allow-Headers': 'Content-Type'
    //                });
    //                res1.end(body, "utf8");
    //            })
    //        });
    //
    //        req.on('error', function (e) {
    //            console.log('problem with request: ' + e.message);
    //            res1.end("");
    //        });
    //
    //        req.write(postData);
    //        req.end();
    //    });



    //var obj = {
    //    "openid" : "",
    //    "area" : "",
    //    "openkey" : "",
    //    "serviceName" : "",
    //    "param" : "",
    //    "timeout" : "6000"
    //};
    //obj.openid = req1.param("openid") || "";
    //obj.openkey = req1.param("openkey") || "";
    //obj.serviceName = req1.param("serviceName") || "";
    //obj.param = req1.param("param") || "";
    //
    //console.log(obj);


    //});

    app.set('port', (process.env.PORT || 8888));

    app.listen(app.get('port'), function() {
        console.log("Node app is running on port:" + app.get('port'))
    });
};

start();