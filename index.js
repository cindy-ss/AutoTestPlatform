var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var socketHandler = require("./server/socketHandler.js");

require("./routers")(app);

//io.on("connection", function(socket){
//    socketHandler(socket, io)
//});

app.set('port', (process.env.PORT || 2338));

http.listen(app.get('port'), function() {
    console.log("Node app is running on port:" + app.get('port'))
});