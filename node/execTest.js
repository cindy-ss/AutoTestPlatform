var cp = require("child_process");

cp.exec("cp -r snapshot/ test", function(err, stdout, stderr){
    console.log(stdout);
    console.log("end");
    //stdout.on("close", function (data) {
    //    console.log(data);
    //    console.log("close");
    //});
    //stdout.on("end", function (data) {
    //    console.log(data);
    //    console.log("end");
    //})
});