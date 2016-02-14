var express = require("express");
var app = express();
//var mail = require("./node/mailIMAP.js");

var handler = require("./server/handler.js");


//app.use("/getmail", function(req, res){
//        mail.getMail(function (data) {
//            //console.log(data);
//            //var arr = eval("(" + data[0] + ")");
//            res.end(data.toString());
//        });
//    });

app.use("/getOsInfo", handler.osHandler);

app.use("/getFileList", handler.fileHandler);

app.use("/imageSearch", handler.imageSearch);

app.use(express.static("./"));

app.set('port', (process.env.PORT || 2333));

app.listen(app.get('port'), function() {
    console.log("Node app is running on port:" + app.get('port'))
});