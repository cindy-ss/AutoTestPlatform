/**
 * Created by Edel on 16/3/16.
 */

var util = require("./util.js");
var dao = require("./dao/emotionDao.js");
var ObjectId = require('mongodb').ObjectID;

var getPresentDots = function(req, res){
    var start = new Date, end = new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    var option = {
        "time" : {
            $gte : new Date(start),
            $lte : new Date(end)
        }
    };
    console.log(option);
    getDots(option, function(data){
        res.write(JSON.stringify(data));
        res.end();
    });
};

var getDots = function(option, cb){
    dao.getDots(option, function(data){
        cb(data);
    });
};

var addDot = function(req, res){
    util.postHandler(req, function (data) {
        var obj = JSON.parse(data);
        console.log(obj);
        obj.time = new Date();

        dao.addDot(obj, function(data){
            console.log(data);
            res.write(JSON.stringify(data));
            res.end();
        });
    });
};

exports.addDot = addDot;
exports.getDots = getPresentDots;
//exports.getDots = getDots;
//exports.getDots = getDots;