/**
 * Created by edel.ma on 6/28/17.
 */

const cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs'),
    URL = require('url'),
    path = require('path');

const query = require('../service/query'),
    adapter = require('../service/adapter'),
    file = require('../service/file'),
    exporter = require('../service/exporter');

const fetchTrans = (url, auth, cb) => {
    if (!path.parse(url).ext) {
        if (url.charAt(url.length - 1) !== "/") {
            url += '/';
        }
    }

    if (!URL.parse(url).protocol) {
        url = 'https://' + url;
    }
    query.query(url, (err, res) => {
        if (!err) {
            const $ = cheerio.load(res);

            let desc = $("meta[name='Description']").attr('content');
            let ogDesc = $("meta[property='og:description']").attr('content');
            let ogTitle = $("meta[property='og:title']").attr('content');
            let ogImage = $("meta[property='og:image']").attr('content');
            let title = $("title").text();

            let ogURLObj = URL.parse(ogImage);
            ogURLObj.host = URL.parse(url).host;
            ogImage = URL.format(ogURLObj);

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
                                }, auth);
                            } else {
                                callback(err, {
                                    url: null,
                                    size: {}
                                })
                            }
                        } else {
                            callback(err, null);
                        }
                    }, auth)
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
                    console.log(`\t[ X ] : Fetching shared images on ${url} failed, with an error of ${err.message}`);
                    cb(err, obj);
                }
            });
        } else {
            console.log(`\t[ X ] : Querying data from ${url} failed, with an error of ${err.message}`);
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

const runTask = (urlStr, auth, cb) => {
    let urlArr = urlStr.split('\n');
    async.map(urlArr, (item, callback) => {
        fetchTrans(item, auth, (err, data) => {
            if(err){
                console.log(`\t[ X ] : Doing meta check failed on ${item}`);
            }
            callback(null, data);
        })
    }, (err, res) => {
        cb(res);
    });
};

const dealHTML = (content, cb) => {
    const exportTime = new Date().getTime();
    const title = `report-${exportTime}`;
    const fileName = `${title}.html`;
    const exportPath = `./static/data/${fileName}`;

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
        .metaStyle > tr > td > div {
           width: 200px;
           height: 200px;
         word-wrap: break-word
}
    </style>
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body class="container-fluid">
    <table class="table table-bordered table-striped table-hover">
    <tbody class="metaStyle">
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
        ${content.map(item => `
            <tr>
                <td><div><a href="${item.url}" target="_blank">${item.url}</a></div></td>
                <td><div>${item.title}</div></td>
                <td${item.desc&&(item.desc.length > 150 || item.desc.length < 100) ? " class='red'" : ""}><div>${item.desc}</div></td>
               
                <td><div>${item.ogTitle}</div></td>
                <td${item.ogDesc&&(item.ogDesc.length > 150 || item.ogDesc.length < 100) ? " class='red'" : ""}><div>${item.ogDesc}</div></td>
                <td class="text-center"><div><img src="${item.ogImage.url}" alt="ogImage" class="ext-thumb"><br>
                Width:${item.ogImage.size.width}.Hight:${item.ogImage.size.height}</div></td>
                <td><div><a href="${item.ogImage.url}" target="_blank">${item.ogImage.url} </div></td>
                <td class="text-center"><div><img src="${item.wechat.url}" alt="wachatImage" class="ext-thumb"><br>
                <br>
                Width:${item.wechat.size.width}.Hight:${item.wechat.size.height}</div></td>
                <td><div><a href="${item.wechat.url}" target="_blank">${item.wechat.url}</div></td>
            </tr>
        `).join('')}
        </tbody>
    </table>
</body>
</html>
    `;

    fs.writeFileSync(exportPath, finalStr, 'utf-8');

    cb(null, fileName);
};

const dealExcel = (content, cb) => {
    const headers = {
        url: 'URL',
        title: 'Title',
        desc: 'Description',
        ogTitle: 'OG Title',
        ogDesc: 'OG Description',


    };
    exporter.dealExcel(headers, content, cb);
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