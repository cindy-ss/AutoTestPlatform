var express = require("express");
var app = express();
var router = express.Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var handler = require("./server/handler.js");

app.use("/getOsInfo", handler.osHandler);

app.use("/getFileList", handler.fileHandler);

app.use("/imageSearch", handler.imageSearch);

router.param("list_id", function(req, res, next, id){
    req.listId = id;
    next();
});

router.route("/cards")
    //.get(function(req, res){
    //    handler.getCards(req, res, "")
    //})
    .get(function(req, res){
        handler.getCards(req, res)
    })
    .post(function(req, res){
        handler.addList(req, res);
    });

router.route("/cards/:list_id")
    .get(function(req, res){
        handler.getCards(req, res, req.listId)
    })
    .post(function(req, res){
        handler.addCard(req, res);
    })
    .delete(function(req, res){
        handler.deleteList(req, res, req.listId);
    });

router.param("card_id", function(req, res, next, id){
    req.cardIndex = id;
    next();
});
router.route("/cards/:list_id/:card_id")
    .all(function(req, res, next){
        console.log("fuck");
        next();
    })
    .delete(function(req, res){
        handler.deleteCard(req, res, req.listId, req.cardIndex);
    });

app.use(router);

//app.use(express.static("./"));
app.use('/', express.static(__dirname + '/'));

io.on("connection", function(socket){
    handler.socketHandler(socket, io)
});

app.set('port', (process.env.PORT || 2333));

http.listen(app.get('port'), function() {
    console.log("Node app is running on port:" + app.get('port'))
});