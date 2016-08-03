var
    request = require('request'),
    //cheerio = require('cheerio'),
    sentiment = require('sentiment');

var src = [
    "I paid $8000 to my party.",
    "我很开心"
];

src.forEach(function(item){
    var res = sentiment(item);
    console.log(item + " : " + res.score);
});
