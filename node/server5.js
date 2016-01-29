var http = require("http");
var qs = require('querystring');
var request = require("request");

var server = http.createServer(function (req, res) {

    var proxyUrl = "";
    if (req.url.indexOf('?') > -1) {
        proxyUrl = req.url.substr(req.url.indexOf('?') + 1);
        console.log(proxyUrl);
    }
    if (req.method === 'GET') {
        request.get(proxyUrl).pipe(res);
    } else if (req.method === 'POST') {
        var post = '';     //定义了一个post变量，用于暂存请求体的信息
        req.on('data', function (chunk) {    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
            post += chunk;
        });
        req.on('end', function () {    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
            post = qs.parse(post);
            request({
                method: 'POST',
                url: proxyUrl,
                form: post
            }).pipe(res);
        });
    }
});

server.listen(process.env.PORT || 8888);
console.log("Server started on", process.env.PORT || 8888);