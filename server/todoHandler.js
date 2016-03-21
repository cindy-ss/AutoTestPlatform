/**
 * Created by Edel on 16/2/16.
 */

var util = require("./util.js");
var dao = require("./dao/dao.js");
var ObjectId = require('mongodb').ObjectID;

var getCards = function (req, res, cardId) {
    dao.exeSql("cards", cardId, "QUERY", function (arr) {
        res.write(JSON.stringify(arr));
        res.end()
    });
};

var addList = function (req, res) {
    util.postHandler(req, function (data) {
        //console.log(data);
        dao.exeSql("cards", JSON.parse(data), "INSERT", function (result) {
            console.log(result);
            res.end("fuck");
        });
        //dao.exeSql()
    });
};

var deleteList = function(req, res, listId){
    var obj = {
        _id : ObjectId(listId)
    };
    dao.exeSql("cards", obj, "DELETE", function(result){
        console.log(result);
        res.end("fuck");
    });
};

var addCard = function (req, res) {
    util.postHandler(req, function(data){
        var temp = JSON.parse(data);
        console.log(temp.listId, temp.content);
        var arr = [
            {
                "_id": ObjectId(temp.listId)
            },
            {
                "$push": {
                    "cards": {
                        "name" : temp.content
                    }
                }
            }
        ];

        dao.exeSql("cards", arr, "UPDATE", function (arr) {
            console.log(arr);
            res.end("fuck");
        });
    });
};

var deleteCard = function(req, res, listId, cardIndex){};

exports.getCards = getCards;
exports.addList = addList;
exports.addCard = addCard;
exports.deleteList = deleteList;
exports.deleteCard = deleteCard;