var express = require("express");
var app = express();

app.use(function(req, res){
    console.log(req.path, req.query);
    res.end("Fuck");
});

app.set('port', (process.env.PORT || 2333));

app.listen(app.get('port'), function() {
    console.log("Node app is running on port:" + app.get('port'))
});