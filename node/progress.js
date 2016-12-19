var process = require("process");

var count = 0,
    signal = "";
//setInterval(function(){
//    switch (count) {
//        case 0 :
//            signal = "-";
//            break;
//        case 1:
//            signal = "\\";
//            break;
//        case 2:
//            signal = "/";
//            break;
//        default:
//            signal = "-"
//    }
//    count = (count + 1) % 3;
//    process.stdout.write(signal + "\r");
//}, 250);
//process.stdout.write("Progress : [");
//for(var i = 0; i < 20; i ++){
//    process.stdout.write(" ");
//}
//process.stdout.write("]");
//for(i = 0; i <= 20; i ++){
//    process.stdout.write("\b");
//}

var print = function(){
    if(count < 20){
        process.stdout.write("#");
        count ++;
        setTimeout(print, 500);
    }else{
        process.stdout.write("] 100% \n");
    }
};
//print();

//process.stdout.write("####1\n###2\n###3");
//process.stdout.write("\r\b\r");
//process.stdout.write("??");
//process.stdout.write("\n");
//process.exit();

var a = 0;
//process.stdout.write('??? %d ', 0);
console.log('??? %d', a);
a = 1;
console.log('??? %d', a);