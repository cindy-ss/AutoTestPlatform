var fs = require("fs");

fs.open("hn_dict.json", "r+", function(err, fd){
    fs.readFile(fd, "utf8", function(err, data1){
        //console.log(data1);
        var obj = JSON.parse(data1);
        console.log(obj.length);
        var res = [];
        for (var i = 0; i < obj.length; i++) {
            var temp = obj[i];
            if(temp.TypeID == 33){
                res.push(temp);
            }
        }
        console.log(res);
    })
});