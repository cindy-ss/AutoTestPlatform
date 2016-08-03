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

Array.prototype.clone = function(){
    return this.slice(0);
};

Array.prototype.unique = function(){
    var result = [], hash = {};
    for (var i = 0, elem; (elem = this[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
};

exports.postHandler = postHandler;