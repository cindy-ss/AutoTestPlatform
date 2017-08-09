/**
 * Created by edel.ma on 7/17/17.
 */

const async = require('async'),
    path = require('path');

const ic = require('../service/image-checker'),
    gh = require('../service/geo_helper'),
    q = require('../service/query'),
    adapter = require('../service/adapter');

const compareImageByURL = (url, geo, auth, cb) => {
    const arr = gh.us2geoByUrl(url, geo);

    let midObj = {
        'CN': [],
        'HKTC': [],
        'HKEN': [],
        'TW': [],
        'MO': []
    };

    getFilterCssArr(url, (filter, res) => {
        async.map(arr, (item, callback) => {
            ic.getImagesByURL(item.url, auth, (err, data) => {
                if (!err) {
                    console.log(item.geo.toUpperCase());
                    midObj[item.geo.toUpperCase()] = data;
                }
                callback(null);
            }, filter)
        }, (err, result) => {
            resFormatter(midObj, res, cb);
        });
    }, auth);
};

const getFilterCssArr = (url, cb, auth) => {
    q.query(url, (err, content) => {
        adapter.cssHandler(content, url, (err, usCssArr) => {
            let filter = usCssArr.map(({url}) => {
                return url;
            });

            async.reduce(usCssArr, [], (memo, item, callback) => {
                q.query(item.url, (err, content) => {
                    adapter.bgHandler(content, item.url, (err, arr) => {
                        if (!err) {
                            callback(null, memo.concat(arr));
                        } else {
                            console.log(item.url);
                            callback(err);
                        }
                    })
                }, auth)
            }, (err, res) => {
                cb(filter, res);
            });


        });
    }, auth);
};

const resFormatter = (midObj, usArr, cb) => {
    let res = [], entry = [];

    for (let geo in midObj) {
        if (midObj.hasOwnProperty(geo)) {
            let tempArr = midObj[geo];

            tempArr.forEach(item => {
                const fileName = path.parse(item)['name'];

                if (entry.indexOf(fileName) === -1) {
                    let obj = {
                        name: fileName,
                    };

                    obj[geo] = item;

                    obj['US'] = usArr.find(usItem => {
                        return path.parse(usItem)['name'] === fileName;
                    });

                    entry.push(fileName);

                    res.push(obj);
                } else {
                    let tempObj = res.find((item) => {
                        return item['name'] === fileName
                    });

                    tempObj[geo] = item;
                }
            })
        }
    }

    cb(null, res);
};

const getUSImages = (url, auth, cb) => {
    ic.getImagesByURL(url, auth, (err, data) => {
        let obj = {
            geo: 'US',
            url: url,
            total: 0,
            list: []
        };
        if (!err) {
            obj.total = data.length;
            obj.list = data;
            cb(null, obj);
        } else {
            cb(null, obj);
        }
    })
};

const exportHTML = (obj, cb) => {
    const exportTime = new Date().getTime();
    const title = `report-${exportTime}`;
    const fileName = `${title}.html`;
    const exportPath = `./static/data/${fileName}`;

    let finalStr ='';

    switch (obj.type){
        case 'us':
            finalStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        .red {
            color : red;
        }
        .ext-thumb {
            width : 60px;
            height : 60px
        }
    </style>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body class="container-fluid">
    <table class="table table-bordered table-striped table-hover">
       <table id="usimg" class="table table-striped table-bordered">
            <thead id="US_header">

            </thead>
            <tbody>
            <tr id="USres_Container"></tr>
            <tr id="USCount"></tr>
            <tr id="USImageUrl"></tr>
            </tbody>
        </table>
        ${obj.data.map(item =>
                `<tr><th>US Image</th>
            <tr>
                <td>${item.data.url}</td>
                <td>${item.data.total}</td>
            </tr>
        `).join('')}
    </table>
</body>
</html>
    `;
            break;
        case 'gc':
            finalStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        .red {
            color : red;
        }
        .ext-thumb {
            width : 60px;
            height : 60px
        }
    </style>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body class="container-fluid">
    <table class="table table-bordered table-striped table-hover">
    </table>
</body>
</html>
    `;
            break;
        default:
            finalStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        .red {
            color : red;
        }
        .ext-thumb {
            width : 60px;
            height : 60px
        }
    </style>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body class="container-fluid">
    <table class="table table-bordered table-striped table-hover">
    </table>
</body>
</html>
    `;
    }

    fs.writeFileSync(exportPath, finalStr, 'utf-8');

    cb(null, fileName);
};


exports.compareImageByURL = compareImageByURL;
exports.getUSImages = getUSImages;
exports.exportHTML = exportHTML;
