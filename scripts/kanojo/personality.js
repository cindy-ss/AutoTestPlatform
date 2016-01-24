/**
 * Created by Edel on 15/11/24.
 */

var action = require("./action");
var think = require("./thinking");
var waiting = require("./waiting");

var name = "Saki";

var wait = function(){
    waiting.wait(function(answer){
        gotIt = typeof think[answer] === "function";
        if(gotIt){
            action.say("I know I know");
        }
        else{
            action.say("I didn't get your points");
        }
    });
};

var say = action.say;

exports.name = name;
exports.wait = wait;
exports.say = say;