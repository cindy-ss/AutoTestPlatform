var fs = require("fs"),
    crypto = require("crypto");

var str1 = fs.readFileSync("./fuck.json", "utf-8");
var str2 = fs.readFileSync("./damn.json", "utf-8");
var str3 = JSON.stringify({
    "fuck" : "fuck"
});

var getHash = function(){
    return crypto.createHash("sha256");
};
var hash = getHash();
hash.update(str1);
console.log(hash.digest("hex"));
hash = getHash();
hash.update(str2);
console.log(hash.digest("hex"));
hash = getHash();
hash.update(str3);
console.log(hash.digest("hex"));