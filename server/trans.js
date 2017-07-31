/**
 * Created by edel.ma on 6/28/17.
 */

const cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs'),
    excel = require('json2excel'),
    URL = require('url');

const query = require('../service/query'),
    adapter = require('../service/adapter'),
    file = require('../service/file');

const fetchTrans = (url, auth, cb) => {
    query.query(url, (err, res) => {
        if (!err) {
            const $ = cheerio.load(res);

            let desc = $("meta[name='Description']").attr('content');
            let ogDesc = $("meta[property='og:description']").attr('content');
            let ogTitle = $("meta[property='og:title']").attr('content');
            let ogImage = $("meta[property='og:image']").attr('content');
            let title = $("title").text();

            let obj = {
                url,
                desc: desc,
                ogDesc,
                ogTitle,
                ogImage: {
                    url: ogImage
                },
                title,
            };

            async.parallel([
                callback => {
                    file.getImageSizeByUrl(ogImage, (err, ogSize) => {
                        callback(err, ogSize)
                    }, auth);
                },
                callback => {
                    adapter.wechatHandler(res, (err, res) => {
                        if (!err) {
                            if (res) {
                                const wechat_url = URL.resolve(url, res);

                                file.getImageSizeByUrl(wechat_url, (err, wechat_size) => {
                                    if (!err) {
                                        callback(err, {
                                            url: wechat_url,
                                            size: wechat_size
                                        });
                                    } else {
                                        callback(null, {
                                            url: wechat_url,
                                            size: {}
                                        })
                                    }
                                })
                            } else {
                                callback(err, {
                                    url: null,
                                    size: {}
                                })
                            }
                        } else {
                            callback(err, null);
                        }
                    })
                }
            ], function (err, results) {
                if (!err) {
                    if (results) {
                        obj.wechat = {
                            url: results[1].url,
                            size: results[1].size
                        };
                        obj.ogImage.size = results[0];
                    }
                    cb(err, obj);
                } else {
                    cb(err, obj);
                }
            });
        } else {
            let obj = {
                url,
                desc: "Bad Link",
                ogDesc: "NA",
                title: 'NA',
                ogTitle: 'NA'
            };
            cb(null, obj);
        }
    }, auth);
};

const runTask = (urlArr, auth, cb) => {
    async.map(urlArr, (item, callback) => {
        fetchTrans(item, auth, callback)
    }, (err, res) => {
        cb(res);
    });
};

const dealHTML = (content, cb) => {
    const exportTime = new Date().getTime();
    const title = `report-${exportTime}`;
    const exportPath = `./static/data/${title}.html`;

    let finalStr = `
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
    <tr>
                <th>URL</th>
                <th>Title</th>
                <th>Description</th>
                <th>OG Title</th>
                <th>OG Description</th>
                <th>OG Img</th>
                <th>OG Img URL</th>
                <th>WeChat Img</th>
                <th>WeChat URL</th>
            </tr>
    `;

    content.forEach(item => {
        finalStr += `
            <tr>
                <td><a href="${item.url}" target="_blank">${item.url}</a></td>
                <td>${item.title}</td>
                <td${item.desc && item.desc.length > 150 ? " class='red'" : ""}>${item.desc}</td>
                <td>${item.ogTitle}</td>
                <td>${item.ogDesc}</td>
                <td class="text-center"><img src="${item.ogImage.url}" alt="ogImage" class="ext-thumb"><br>
                Width:${item.ogImage.size.width}.Hight:${item.ogImage.size.height}</td>
                <td>${item.ogImage.url} </td>
                <td class="text-center"><img src="${item.wechat.url}" alt="wachatImage" class="ext-thumb"><br>
                <br>
                Width:${item.wechat.size.width}.Hight:${item.wechat.size.height}</td>
                <td>${item.wechat.url}</td>
            </tr>
            `;
    });

    finalStr += `</table>
</body>
</html>
`;

    fs.writeFileSync(exportPath, finalStr, 'utf-8');

    cb(null, exportTime);
};

const dealExcel = (content, cb) => {
    const exportTime = new Date().getTime();
    const title = `report-${exportTime}`;
    const exportPath = `./static/data/${title}.xlsx`;
    let data = {
        sheets: [
            {
                header: {
                    url: 'URL',
                    desc: 'Description',
                    ogDesc: 'OG Description',
                    title: 'Title',
                    ogTitle: 'OG Title',
                },
                items: [],
                sheetName: 'Report',
            }
        ],
        filepath: exportPath
    };

    data.sheets[0].items = content;

    excel.j2e(data, function (err) {
        console.log('finish');
        cb(err, exportTime);
    });
};

const export2Xls = (obj, cb) => {
    switch (obj.type) {
        case "html" :
            dealHTML(obj.xls, cb);
            break;
        default:
            dealExcel(obj.xls, cb);
    }
};

exports.runTask = runTask;
exports.export2Xls = export2Xls;