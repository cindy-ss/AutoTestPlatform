var cheerio = require("cheerio");
var http = require('http');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var url = require('url');
var request = require("request");
var crawler = require("../crawler.js");

var imgArr = [];

exports.deal = function(url, data){
    var arr = url.split("/");
    var current = arr[arr.length - 1];

    var $ = cheerio.load(data);
    var title = $("h2").first().text();
    $('img').each(function(i, elem) {
        imgArr.push(elem.attribs.src);
    });
    var next = $('.image').children("a").last().attr("href");

    if(next != current){
        console.log("抓取下一页");
        arr[arr.length - 1] = next;
        crawler.deal(arr.join("/"));
    }
    else{
        console.log("抓取结束");
        var res = {};
        res.title = title;
        res.images = imgArr;
        res.time = "";
        return res;
    }
};