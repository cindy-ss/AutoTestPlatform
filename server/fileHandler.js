var fs = require("fs");
var path = require("path");
var util = require("./util.js");

var fileHandler = function(req, res){
    util.postHandler(req, function(data){
        var temp = JSON.parse(data);
        switch (temp.action){
            case "list" :
                readDir(temp.dir, res);
                break;
            case "read" :
                readFile(temp.dir, res);
                break;
            default:
                break;
        }
    });
};

var readDir = function(url, res){
    fs.readdir(url, function(err, files){
        var result = [];
        files.forEach(function(key, value){
            if(key.charAt(0) != "."){
                var obj = {
                    "path" : url + key,
                    "name" : key
                };
                obj.extName = path.extname(obj.path).toLowerCase();
                obj.stat = fs.statSync(obj.path);
                obj.isFile = obj.stat.isFile();
                obj.isDir = obj.stat.isDirectory();
                result.push(obj);
            }
        });
        res.write(JSON.stringify(result));
        res.end();
    });
};

var readFile = function(url, res){
    var ext = path.extname(url).toLowerCase();
    switch(ext){
        case ".jpg":
        case ".jpeg":
        case ".png":
            fs.readFile(url, function(err, data){
                if(err) throw err;
                var obj = {
                    ext : ext
                };
                obj.data = data.toString("base64");
                res.write(JSON.stringify(obj));
                res.end();
            });
            break;
        default:
            fs.readFile(url, "utf8", function(err, data){
                if (err) throw err;
                var obj = {
                    ext : ext
                };
                obj.data = data;
                res.write(JSON.stringify(obj));
                res.end();
            });
    }
};

exports.fileHandler = fileHandler;