var http = require("http");

http.get('http://www.baidu.com', function(res){
    data = "";
    res.on('data', function(chunk){
        data += chunk;
    });
    res.on('end', function(){
        console.log(data);
    });
res.resume();
}).on('error', function(e){
    console.log('Got error: ',e.message);
});