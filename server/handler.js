/**
 * Created by Edel on 16/2/2.
 */

var os = require("os");
var fs = require("fs");
var path = require("path");
var util = require("./util.js");
var httpHandler = require("./httpHandler.js");
var fileHandler = require("./fileHandler.js");
var todoHandler = require("./todoHandler.js");

var osHandler = function(req, res){
    var obj = {};
    obj.cpu = os.cpus();
    obj.freemem = os.freemem();
    obj.totalmem = os.totalmem();
    obj.platform = os.platform();
    res.write(JSON.stringify(obj));
    res.end();
};


exports.osHandler = osHandler;
exports.fileHandler = fileHandler.fileHandler;
exports.fileSearch = httpHandler.fileSearch;
exports.imageSearch = httpHandler.imageSearch;
exports.getCards = todoHandler.getCards;
exports.addList = todoHandler.addList;
exports.addCard = todoHandler.addCard;
exports.deleteList = todoHandler.deleteList;
exports.deleteCard = todoHandler.deleteCard;