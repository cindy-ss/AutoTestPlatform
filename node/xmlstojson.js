//node_xj = require("xlsx-to-json");
//node_xj({
//    input: "sheet.xlsx",  // input xls
//    output: "data.json", // output json
//    sheet: "Sheet1"  // specific sheetname
//}, function(err, result) {
//    if(err) {
//        console.error(err);
//    } else {
//        console.log(result);
//    }
//});

var parseXlsx = require('excel');

parseXlsx('sheet.xlsx', function(err, data) {
    if(err) throw err;
    console.log(data);
    // data is an array of arrays
});