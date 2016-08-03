/**
 * Created by Edel on 16/4/13.
 */
var crawler = require("../crawler.js");
var cheerio = require("cheerio");

exports.deal = function(url, data){
    data = data.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    var $ = cheerio.load(data);
    var res = {
        articles : []
    };
    $("item").each(function(i, e){
        var article = {};
        article.title = $(this).children("title").first().text();
        //article.link = $(this).children("link").first().text();
        article.content = $(this).children("description").first().text();
        //console.log($(this).html());
        res.articles.push(article);
    });
    return res;
};