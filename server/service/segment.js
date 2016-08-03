/**
 * Created by Edel on 16/4/13.
 */
var seg = require("nodejieba");
var crawler = require("./crawler.js");

var arr = [];
crawler.deal("http://www.solidot.org/index.rss", function(data){
    data.articles.forEach(function(value, key){
        //console.log(value);
        var res = seg.extract(value.content, 5);
    })
});