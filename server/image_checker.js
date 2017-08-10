/**
 * Created by edel.ma on 7/17/17.
 */

const async = require('async'),
    path = require('path'),
    fs = require('fs');

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
                            callback(null, memo);
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

    let finalStr = '';

    switch (obj.type) {
        case 'us':
            finalStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        .ext-thumb {
            max-width : 60px;
            max-height : 60px
        }
    </style>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body class="container-fluid">
    <table class="table table-bordered">
        <thead class="text-center">
        <tr id="image_us_geo_title">
            <td colspan="2">US</td>
        </tr>
        </thead>
        <tbody id="image_us_res">
        <tr>
            <td class="text-left">${obj.data.url}</td>
            <td class="text-left">${obj.data.total}</td>
        </tr>
        ${obj.data.list.map(item => `
        <tr><td><img src="${item}" alt="ImageUrl" class="ext-thumb"></td><td style="word-wrap:break-word"><a href="${item}">${item}</a></td></tr>
        `).join('')}
                </tbody>
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
        .ext-thumb {
            max-width : 60px;
            max-height : 60px
        }
        table td {
            word-break: break-all;
        }
    </style>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body class="container-fluid">
    <table class="table table-bordered">
        <thead class="text-center">
        <tr>
            <td>Name</td>
            <td id="image_td_us_title">US</td>
            <td id="image_td_cn_title">CN</td>
            <td id="image_td_hktc_title">HK</td>
            <td id="image_td_hken_title">HKEN</td>
            <td id="image_td_tw_title">TW</td>
            <td id="image_td_mo_title">MO</td>
        </tr>
        </thead>
        <tbody>
        ${obj.data.map(item => `
            <tr><td rowspan="2">${item.name}</td>
            ${['US', 'CN', 'HKTC', 'HKEN', 'TW', 'MO'].map(geo => `
                <td><img class="ext-thumb" src="${item[geo] || ''}" alt="${item[geo] || ''}" /></td>
            `).join('')}
            </tr><tr>
            ${['US', 'CN', 'HKTC', 'HKEN', 'TW', 'MO'].map(geo => `
                <td><a href="${item[geo] || ''}" target="_blank">${item[geo] || ''}</a></td>
            `).join('')}
            </tr>
        `).join('')}
        </tbody>
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
        .ext-thumb {
            max-width : 60px;
            max-height : 60px
        }
        table td {
            word-break: break-all;
        }
    </style>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body class="container-fluid">
    <table class="table table-bordered">
        <thead class="text-center">
        <tr>
            <td>Name</td>
            <td>US</td>
            <td>${obj.type}</td>
        </tr>
        </thead>
        <tbody id="image_gc_res">
        ${obj.data.map(item => `
            <tr><td rowspan="2">${item.name}</td>
            ${['US', obj.type.toUpperCase()].map(geo => `
                <td><img class="ext-thumb" src="${item[geo] || ''}" alt="${item[geo] || ''}" /></td>
            `).join('')}
            </tr><tr>
            ${['US', obj.type.toUpperCase()].map(geo => `
                <td><a href="${item[geo] || ''}" target="_blank">${item[geo] || ''}</a></td>
            `).join('')}
            </tr>
        `).join('')}
        </tbody>
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
