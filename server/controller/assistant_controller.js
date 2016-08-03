/**
 * Created by Edel on 16/4/12.
 */
var crawler = require("../service/crawler.js");
var config = {};
config.emotions = ["angry", "confused", "cry", "fucked", "fucking", "hate", "laugh", "like", "normal", "sad", "shy", "suprise"];

exports.answer = function(words, cb){
    console.log(words);
    var res = {
        words : "好啊",
        emotions : "normal"
    };
    if(words.indexOf("资讯") != "-1"){
        res.words = "今天发生的新鲜事有:<br/>";
        crawler.deal("http://www.solidot.org/index.rss", function(data){
            data.articles.forEach(function(v, i){
                res.words += v.title + "<br/>";
                //res.words += "<a href='" + v.link + "'>" + v.title + "</a><br/>  ";
            });
            cb(res);
        }, function(err){
            res.words = "找不到想要的东西啦……";
            res.emotions = "cry";
            cb(res)
        });
    }else{
        cb(res);
    }
};

exports.getRandomEmotion = function(){
    var i = Math.floor(Math.random() * config.emotions.length);
    return config.emotions[i];
};

exports.greeting = function(){
    var h = new Date().getHours();
    var words = "";
    var emotions = "";
    switch (h) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 23:
            words = "现在还是夜里啊……";
            emotions = "hate";
            break;
        case 8:
        case 9:
        case 10:
            words = "早上好~要好好上班哦~";
            emotions = "laugh";
            break;
        case 11:
            words = "中午好~要休息啦~中午吃什么呢?";
            emotions = "fucking";
            break;
        case 12:
        case 13:
            words = "唔……睡午觉……";
            emotions = "fucking";
            break;
        case 14:
            words = "上班啦~没睡够啊……";
            emotions = "hate";
            break;
        case 15:
        case 16:
            words = "下午好~好好上班哟~";
            emotions = "like";
            break;
        case 17:
            words = "再努力一下,就要下班啦~";
            emotions = "like";
            break;
        case 18:
            words = "下班啦~~啊哈哈~~~";
            emotions = "fucked";
            break;
        case 19:
        case 20:
        case 21:
            words = "晚上好~";
            emotions = "like";
            break;
        case 22:
            words = "困了……要睡觉……";
            emotions = "fucked";
            break;
        default:
            emotions = "normal";
            words = "你好啊~";
    }
    return {
        words : words,
        emotions : emotions
    };
};