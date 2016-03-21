/**
 * Created by Edel on 16/3/16.
 */

var dao = require("./dao.js");
var ObjectId = require('mongodb').ObjectID;



var addDot = function(obj, cb){
    dao.exeSql("emotion", obj, "INSERT", function(result){
        cb(result);
    });
};

var deleteDot = function(){};

var updateDot = function(){};

/*
* option = {type};
* params: type:["day"/"week"/"month"/"year"]
* */
var getDots = function(option, cb){
    dao.exeSql("emotion", option, "QUERY", function (arr) {
        cb(arr);
    });
};

exports.addDot = addDot;
exports.getDots = getDots;
exports.deleteDot = deleteDot;
exports.updateDot = updateDot;