/**
 * Created by edel.ma on 6/28/17.
 */

const request = require('request');
const cheerio = require('cheerio');
// const conf = require('./conf').conf;
const async = require('async');
const fs = require('fs');
const excel = require('json2excel');
const query = require('../service/query');

const sizeOf = require('image-size');
const file = require('../service/file');
const URL = require('url');
const adapter = require('../service/adapter');

const fetchTrans = (url, cb) => {
    query.query(url, (err, res) => {
        if (!err) {
            const $ = cheerio.load(res);
            let desc = $("meta[name='Description']").attr('content');

            let ogDesc = $("meta[property='og:description']").attr('content');

            let ogTitle = $("meta[property='og:title']").attr('content');

            let ogImage =$("meta[property='og:image']").attr('content');

            let title = $("title").text();

            let p = URL.parse(url);

            adapter.wechatHandler(res, (err, res1) => {
                if(!err){
                    if (res1==null){
                        console.log("null");
                        let obj = {
                            url,
                            desc,
                            title,
                            ogTitle,
                            ogDesc,
                            ogImage,
                            wechaturl:"No WeChat Img",
                            obj1:"NA"
                        };
                        cb(err, obj);

                    }else{

                        let wechaturl = p.protocol + "//" + p.hostname + res1;

                        console.log("src="+src);
                        file.getImageSizeByUrl(wechaturl, (err, obj1) => {
                            //console.log(" obj width="+obj1.width);
                            let obj = {
                                url,
                                title,
                                ogTitle,
                                ogDesc,
                                ogImage,
                                wechaturl,
                                obj1

                            };
                            cb(err, obj);

                        });

                    }
                }

            })




        } else {

            console.log("404");
            let obj = {
                url,
                title: 'NA',
                wechaturl:'NA',
                obj1:'NA'
            };
            cb(null, obj);
        }
    });
};

const runTask = (urlArr, auth, cb) => {
    async.map(urlArr, (item, callback) => {
        fetchTrans(item, auth, callback)
    }, (err, res) => {
        cb(res);
    });
};

const dealHTML = (content, cb) => {
    const exportPath = `report${new Date().getTime()}.html`;

    let finalStr = `
<style>
.red {
color : red;
}
table td, table, th {
border : 1px solid gray;
border-collapse: collapse;
}
</style>
    <table>
    <tr>
                <th>URL</th>
                <th>Title</th>
                <th>WeChat Info</th>
                <th>WeChat URL</th>
                
            </tr>
    `;

    content.forEach(item => {
        finalStr += `
            <tr>
                <td><a href="${item.url}">${item.url}</a></td>
                <td>${item.title}</td>
                <td><img src="${item.wechaturl}" height="60" width="60"><br>
                     Width:${item.obj1.width}.Hight:${item.obj1.height}</td>
                <td> URL:${item.wechaturl}}<br></td>
            </tr>
            `;
    });

    finalStr += "</table>";

    fs.writeFileSync(`static/data/${exportPath}`, finalStr, 'utf-8');

    cb(null, exportPath);
};

const dealExcel = (content, cb) => {
    const exportPath = `report${new Date().getTime()}.xlsx`;
    let data = {
        sheets: [
            {
                header: {
                    url: 'URL',
                    title: 'Title',
                    wechaturl: 'WeChat',
                },
                items: [],
                sheetName: 'Report',
            }
        ],
        filepath: `static/data/${exportPath}`
    };

    data.sheets[0].items = content;

    excel.j2e(data, function (err) {
        console.log(err);
        console.log('finish');
        cb(err, exportPath);
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