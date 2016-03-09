/**
 * Created by Edel on 16/2/23.
 */

var roomList = {};

var room = function(str){
    return {
        name : str,
        member : [],
        isGaming : false,
        master : null
    }
};

var socketHandler = function(socket, io){
    var joinRoom = function(socket, str){
        socket.join(str);
        roomList[str].member.push(socket.id);
        socket.emit("createRoomCB", str);
        io.emit("roomList", roomList);
    };

    socket.emit("roomList", roomList);

    socket.on("joinRoom", function(str){
        joinRoom(socket, str);
    });

    socket.on("createRoom", function(str){
        roomList[str] = room(str);
        joinRoom(socket, str);
    });

    socket.on("getRoomInfo", function(str){
        socket.emit("roomInfo", roomList[str]);
    });

    socket.on('disconnect', function(){
        console.log(socket.id + " disconnect");
    });
};

exports.socketHandler = socketHandler;