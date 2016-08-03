/**
 * Created by Edel on 15/11/25.
 */

var readline = require("readline");

var wait = function(callback){
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Tell me something?", function(answer) {
        // TODO: Log the answer in a database
        callback(answer);
        rl.close();
    });
};

var asking = function(){};

exports.wait = wait;
exports.ask = asking;