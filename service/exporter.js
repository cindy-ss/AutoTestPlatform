/**
 * Created by edel.ma on 8/7/17.
 */


const excel = require('json2excel');

const dealExcel = (headers, content, cb) => {
    const exportTime = new Date().getTime();
    const title = `report-${exportTime}`;
    const fileName = `${title}.xlsx`;
    const exportPath = `./static/data/${fileName}`;

    let data = {
        sheets: [
            {
                header: headers,
                items: [],
                sheetName: 'Report',
            }
        ],
        filepath: exportPath
    };

    data.sheets[0].items = content;

    excel.j2e(data, function (err) {
        cb(err, fileName);
    });
};

exports.dealExcel = dealExcel;