/**
 * Created by Edel on 16/3/21.
 */
var fs = require("fs");

fs.open("../data/fuck.xml", "r+", function(err, fd){
    console.log(fd);
    fs.readFile(fd, "utf8", function(err, data1){
        console.log(data1);
        data1 = "fuck";
        //fs.writeFile(fd, "Hello", function(err){
        //    console.log(err);
        //})
    })
});