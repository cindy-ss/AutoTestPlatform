/**
 * Created by Edel on 16/2/16.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var exeSql = function(col, obj, method, cb){
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        switch (method){
            case "QUERY" :
                console.log("====this is a get method====");
                queryData(db, col, obj, function(arr){
                    cb(arr);
                    db.close();
                });
                break;
            case "INSERT" :
                console.log("this is a insert method");
                insertData(db, col, obj, function(res){
                    cb(res);
                    db.close();
                });
                break;
            case "UPDATE" :
                console.log("this is a update method");
                updateData(db, col, obj, function(res){
                    cb(res);
                    db.close();
                });
                break;
            case "DELETE" :
                console.log("====this is a delete method====");
                deleteData(db, col, obj, function(res){
                    cb(res);
                    db.close();
                });
                break;
            default :
                console.log("this is a default one");
        }
    });

};

var queryData = function(db, col, queryStr, callback) {
    var cursor = queryStr? db.collection(col).find(queryStr) : db.collection(col).find();
    var res = [];
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            res.push(doc);
        } else {
            callback(res);
        }
    });
};

//todo insertMany action doesn't finish.
var insertData = function(db, col, obj, callback){
    db.collection(col).insertOne(obj, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
};

//todo updateMany action doesn't finish.
var updateData = function(db, col, sql, callback){
    db.collection(col).updateOne(sql[0], sql[1], function(err, result){
        callback(result);
    });
};

//todo deleteOne and drop table action doesn't finish.
var deleteData = function(db, col, sql, callback){
    db.collection(col).deleteMany(sql, function(err, results) {
            console.log(results);
            callback(results);
        }
    );
};

//var list = {
//    index : 0,
//    name : "undo",
//    cards : []
//};
//exeSql("cards", list, "INSERT", function(res){
//    console.log(res);
//});

//var list = {
//    _id : ObjectId('56c2e8c4cf08e56e179a4df6')
//};
//exeSql("cards", list, "QUERY", function(res){
//    console.log(res);
//});
//
//var arr = [
//    {
//        "_id" : ObjectId("56c2bb712ba9a31a11a42398")
//    },
//    {
//        "$unset" : {
//            "cards.3" : 1
//        }
//    }
//];
//
//exeSql("cards", arr, "UPDATE", function(arr){
//    console.log(arr);
//});

exports.exeSql = exeSql;