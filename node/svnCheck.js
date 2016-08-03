var later = require("later");
var spawn = require("child_process").spawn;

var isChecking = false;

var check = function () {
    if(isChecking){
        console.log("Still Checking!");
        return;
    }
    var svn = spawn('svn', ['co', 'svn://10.225.8.214/9_%E4%B8%AA%E4%BA%BA%E6%96%87%E6%A1%A3/%E9%A9%AC%E7%BE%A4', 'fuck', '--username', 'lihao', '--password', 'lh']);

    isChecking = true;

    svn.stdout.on('data', function(data){
        console.log('stdout: ' + data);
    });

    svn.stderr.on('data', function(data){
        console.log('stderr: ' + data);
    });

    svn.on('close', function(code){
        if(code.toString() == '0'){
            console.log('Check Out Finish!');
        }
        else{
            console.log("Check Out Failed!");
        }
        isChecking = false;
    });
};

exports.getState = function () {
    return isChecking;
};

exports.init = function(){
    var schedule = later.parse.recur().every(3).minute();
    var task = later.setInterval(check, schedule);
};