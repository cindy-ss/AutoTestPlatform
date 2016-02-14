/**
 * Created by Edel on 16/2/2.
 */

var util = require("./util.js");
var htmlparser = require("htmlparser2");
var http = require("http");
var https = require("https");
var path = require("path");
var async = require("async");
var fs = require("fs");

var fileSearch = function(req, res){};

var imageSearch = function(req, res){
    util.postHandler(req, function(url){
        var imageArr = [];
        var handler = {
            onopentag: function(name, attribs){
                if(name === "img" ){
                    var temp = attribs.src;
                    if(temp.indexOf("http") != 0 && temp.indexOf("https") != 0){
                        if(temp.indexOf('//') == 0){
                            temp = temp.substr(temp.indexOf("//") + 2);
                            temp = "http://" + temp;
                        }
                        else{
                            var arrTemp = temp.split("/");
                            var arrUrl = url.substr(url.indexOf("//") + 2).split("/");
                            temp = "http://" + arrUrl.concat(arrTemp).join("/");
                        }
                    }
                    console.log("image Haken:" + temp);
                    console.log(" ");
                    imageArr.push(temp);
                }
                //if(name === "script" && attribs.type === "text/javascript"){
                //    console.log("JS! Hooray!");
                //}
            },
            ontext: function(text){
                //console.log("-->", text);
            },
            onclosetag: function(tagname){
                //if(tagname === "script"){
                //    console.log("That's it?!");
                //}
            },
            onend : function(){
                res.write(JSON.stringify(imageArr));
                res.end();
            }
        };
        domHandler(url, handler);
    });
};

var domHandler = function(url, handler){
    if(url.indexOf("https") == 0){
        https.get(url, function(res){
            util.postHandler(res, function(data){
                var options = {
                    decodeEntities: true
                };
                var parser = new htmlparser.Parser(handler, options);

                parser.write(data);
                parser.done();
            });
            res.resume();
        }).on('error', function(e){
            console.log('Got error: ',e.message);
        });
    }
    else{
        //TODO domhandler should be used.
        http.get(url, function(res){
            util.postHandler(res, function(data){
                var options = {
                    decodeEntities: true
                };
                var parser = new htmlparser.Parser(handler, options);

                parser.write(data);
                parser.done();
            });
            res.resume();
        }).on('error', function(e){
            console.log('Got error: ',e.message);
        });
    }
};



var imageListDownload = function(arr, target){
    var imageDownload = function(url, cb){
        console.log(url);
        http.get(url, function(res){
            util.postHandler(res, function(data){
                var name = target + "/" + times + path.basename(url);
                console.log(data.toString("base64"));
                times ++;
                fs.writeFile(name, data, function(err, written, string){
                    cb("", true);
                });
            });

            res.resume();
        });
    };
    var times = 0;
    async.map(arr, imageDownload, function(err, res){
        console.log(res);
    });
};

imageListDownload(["http://s1.dwstatic.com/group1/M00/55/C1/6ccc84a90ec32a800003eeca74a4047f.jpg", "http://s1.dwstatic.com/group1/M00/55/C1/6ccc84a90ec32a800003eeca74a4047f.jpg"], "/Users/Edel/project/github/lab");

exports.fileSearch = fileSearch;
exports.imageSearch = imageSearch;