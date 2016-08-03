/**
 * Created by Edel on 16/2/23.
 */

var dao = require("./dao/roomDao.js");
var assistant = require("./controller/assistant_controller.js");
var timer = require("timers");
var later = require("later");

var roomList = {};
var userList = {};

var arrRemove = function(arr, str){
    var temp = arr;
    if(arr.indexOf(str) !== -1){
        temp = arr.splice(arr.indexOf(str), 1);
    }
    return temp;
};

var room = function(str){
    return {
        name : str,
        member : [],
        isGaming : false,
        master : undefined
    }
};

var user = function(name, socketId){
    return {
        name : name,
        socketId : socketId,
        room : undefined,
        loginTime : new Date().getTime()
    }
};

var socketHandler = function(socket, io){
    var joinRoom = function(socket, str){
        try{
            socket.join(str);
            if(roomList[str].member.indexOf(socket.id) === -1){
                roomList[str].member.push(socket.id);
            }
            userList[socket.id].room = str;
            io.emit("roomList", roomList);
            return str;
        }
        catch (e){
            return false;
        }
    };

    var leaveRoom = function(socket, str){
        var currentRoom = roomList[str];
        socket.leave(str);
        arrRemove(currentRoom.member, socket.id);
        if(currentRoom.member.length <= 0){
            delete roomList[str];
        }
        userList[socket.id].room = undefined;
        io.emit("roomList", roomList);
        return true;
    };

    var closeRoom = function(socket, str){
    };

    var logout = function(){};

    var shutup = function(){
        timer.setTimeout(function(){
            socket.emit("answer", "");
            socket.emit("emotion", "normal");
        }, 4000);
    };


    var getAllRooms = function(socket){
        dao.getRooms("", function(arr){
            socket.emit("roomList", arr);
        })
    };

    //getAllRooms(socket);

    socket.on("login", function(str){
        var info = JSON.parse(str);
        var name = info["name"];
        userList[socket.id] = user(name, socket.id);
        socket.emit("loginCB", true);
    });

    socket.on("logout", function(){});

    socket.on("getRoomList", function(){
        getAllRooms(socket);
    });

    socket.on("joinRoom", function(str){
        dao.joinRoom(socket, str, function(res){
            //socket.emit("joinRoomCB", joinRoom(socket, str));
            socket.emit("joinRoomCB", res);
        })
    });

    socket.on("leaveRoom", function(str){
        socket.emit("leaveRoomCB", leaveRoom(socket, str));
    });

    socket.on("startRoom", function(str){
    });

    socket.on("createRoom", function(str){
        roomList[str] = room(str);
        //socket.emit("createRoomCB", joinRoom(socket, str));
        socket.emit("joinRoomCB", joinRoom(socket, str));
    });

    socket.on("getRoomInfo", function(str){
        socket.emit("roomInfo", JSON.stringify(roomList[str]));
    });

    socket.on("say", function(str){
        assistant.answer(str, function(res){
            socket.emit("answer", res.words);
            socket.emit("emotion", res.emotions);
            //shutup();
        });
    });

    var greeting = function(){
        socket.emit("emotion", assistant.greeting().emotions);
        socket.emit("answer", assistant.greeting().words);
        shutup();
    };

    greeting();
    //var sched = later.parse.recur().every(5).second(),
    //    t = later.setInterval(greeting, sched);

    socket.on("touch", function(){
        socket.emit("answer", "没事不要乱摸啦,混蛋");
        socket.emit("emotion", "confused");
        shutup();
    });


    socket.on('disconnect', function(){
        console.log(socket.id + " disconnect");

        if(userList[socket.id]) {
            //dao.leaveRoom();
            var tempRoom = userList[socket.id].room;
            if (tempRoom) {
                leaveRoom(socket, tempRoom);
            }
            delete userList[socket.id];
        }
    });
};


module.exports = socketHandler;