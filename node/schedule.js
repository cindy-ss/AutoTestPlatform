/**
 * Created by Edel on 16/3/21.
 */
var schedule = require("node-schedule");

var rule = new schedule.RecurrenceRule();
rule.second = [5, 10, 15, 20];
var j = schedule.scheduleJob(rule, function(){
    console.log("Fuck!");
});