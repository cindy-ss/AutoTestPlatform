/**
 * Created by Edel on 16/4/12.
 */
//https://mm.taobao.com/

var cheerio = require("cheerio");
var http = require('https');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var url = require('url');

var imgArr = [];

var search = function(str, cb, charset){
    charset = charset || "utf-8";
    console.log("正在抓取:" + str);

    var arr = str.split("/");
    var temp = arr[arr.length - 1];

    var target = url.parse(str);
    http.get(target,function(res){
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end',function(){
            var data = iconv.decode(bufferHelper.toBuffer(), charset);
            cb(data);
        });
    });
};

var indexCB = function(data){
    var $ = cheerio.load(data);
    var target = $(".lady-commonNav-tstar").first().attr("href");
    //console.log(target);
    search("https://mm.taobao.com" + target, function(data){
        console.log(data);
        var $ = cheerio.load(data);
    }, "gbk");
};

//search("https://mm.taobao.com", indexCB);
search("https://mm.taobao.com/search_tstar_model.htm?spm=719.7763510.1998606017.2.CN7021", function(data){
    console.log(data);
}, "gbk");

exports.search = search;