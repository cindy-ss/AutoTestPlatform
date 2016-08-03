var ppmsg = require("./crawler/6642.js");
var solidot = require("./crawler/solidot.js");
var general = require("./crawler/general.js");
var request = require("request");
var fs = require("fs");
var iconv = require('iconv-lite');

//ppmsg.search("http://www.ppmsg.net/siwameitui/201604/26853.html", function(obj){
//    //console.log("Done")
//    if (!fs.existsSync(obj.title)) {
//        fs.mkdirSync(obj.title);
//    }
//    obj.images.forEach(function(data){
//        var arr = data.split("/");
//        var temp = arr[arr.length - 1];
//        var filePath = obj.title + "/" + temp;
//        console.log(data);
//        request(data).pipe(fs.createWriteStream(filePath));
//    });
//});

var deal = function(url, cb, fail){
    var temp = url.split("//");
    var arr = temp[temp.length - 1].split("/");
    var site = arr[0];
    var action;
    var encoding = "utf-8";
    switch (site){
        case "www.ppmsg.net":
            action = ppmsg.deal;
            encoding = "gbk";
            break;
        case "www.solidot.org":
            action = solidot.deal;
            break;
        default:
            action = general.deal;
    }
    request({
        url : url,
        timeout : 10000
    })
        .on('error', function(err) {
            fail(err)
        })
        .pipe(iconv.decodeStream(encoding))
        .collect(function(err, data){
            var res = action(url, data);
            if(res){
                cb(res);
            }
        })
};
//deal("http://www.ppmsg.net/siwameitui/201604/26853.html");
//deal("http://www.solidot.org/");
//deal("http://www.baidu.com/");
//deal("http://www.solidot.org/index.rss");
//deal("http://solidot.org.feedsportal.com/c/33236/f/556826/index.rss");
deal("http://weibo.com/1644161863/DqNGbreko");

exports.deal = deal;