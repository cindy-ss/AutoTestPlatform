node_xj = require("xlsx-to-json");
node_xj({
    input: "sheet.xlsx",  // input xls
    output: "data.json", // output json
    sheet: "Sheet1"  // specific sheetname
}, function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});