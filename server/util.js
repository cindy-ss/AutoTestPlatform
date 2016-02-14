/**
 * Created by Edel on 16/2/3.
 */

var postHandler = function(req, cb){
    var data = "";
    req.on("data", function(chunk){
        data += chunk;
    });
    req.on("end", function(){
        cb(data);
    });
};

exports.postHandler = postHandler;