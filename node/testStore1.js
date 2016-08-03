var s = require("./store.js");

exports.deal = function () {
    console.log(s.arr);
    s.arr = [1, 2, 3];
};