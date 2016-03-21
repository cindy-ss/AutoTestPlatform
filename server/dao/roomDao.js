/**
 * Created by Edel on 16/3/11.
 */

var dao = require("./dao.js");
var ObjectId = require('mongodb').ObjectID;

var createRoom = function(roomId, cb){
    var obj = {
        name : roomId,
        member : [],
        isGaming : false,
        master : undefined
    };
    dao.exeSql("rooms", obj, "INSERT", function(result){
        cb(result);
    });
};

var joinRoom = function(socket, roomId, cb){
    var obj = [
        {
            "_id": ObjectId(roomId)
        },
        {
            "$push": {
                "member": socket.id
            }
        }
    ];
    dao.exeSql("rooms", obj, "UPDATE", function(result){
        cb(result);
    });
};

var leaveRoom = function(socket, roomId, cb){
    var obj = [
        {
            "_id": ObjectId(roomId)
        },
        {
            "$pull": {
                "member": socket.id
            }
        }
    ];
    dao.exeSql("rooms", obj, "UPDATE", function(result){
        cb(result);
    });
};

var removeRoom = function(roomId, cb){
    var obj = {
        _id : ObjectId(roomId)
    };
    dao.exeSql("rooms", obj, "DELETE", function(result){
        cb(result);
    });
};

var getRooms = function(roomId, cb){
    dao.exeSql("rooms", roomId, "QUERY", function(arr){
        cb(arr)
    });
};

exports.createRoom = createRoom;
exports.removeRoom = removeRoom;
exports.getRooms = getRooms;
exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;