/**
 * Created by Edel on 16/1/25.
 */
var http = require("http");
var querystring = require('querystring');

var server = http.createServer(function (req, res) {
    //if(req.url == "/" && req.method == "POST"){
    var temp = "";
    req.on('data', function (chunk) {
        temp += chunk;
    });

    req.on('end', function () {
        console.log("Data End with: " + temp);
        temp = temp || '{}';
        var data = eval("(" + temp + ")");
        console.log("Data After Eval: " + data);

        if (data) {
            //console.log(temp.substring(temp.indexOf('param')));
            console.log(JSON.stringify(data.param));
        }

        var postData = querystring.stringify(data) + JSON.stringify(data.param) || "";
        console.log("data before posting: " + postData);
        //console.log(temp.length);

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

        var reqInner = http.request(options, function (resInner) {
            console.log('STATUS: ' + resInner.statusCode);
            var body = "";
            resInner.on('data', function (chunk) {
                body += chunk;
            });
            resInner.on('end', function () {
                body = body.substring(13, body.length);
                console.log('body : ' + body);
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=UTF-8",
                    "Access-Control-Allow-Origin": '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
                res.end(body, "utf8");
            })
        });

        reqInner.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            res.end("");
        });

        reqInner.write(postData);
        reqInner.end();
    });

    //}
});

server.listen(process.env.PORT || 8888);
console.log("Server started on", process.env.PORT || 8888);