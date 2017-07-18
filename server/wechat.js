/**
 * Created by edel.ma on 6/28/17.
 */

const request = require('request');
const cheerio = require('cheerio');
const conf = require('./conf').conf;
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
                            wechaturl:"No WeChat Img",
                            obj1:"NA"

                        };
                        cb(err, obj);

                    }else{

                        let wechaturl = p.protocol + "//" + p.hostname + res1;
                        let src = wechaturl;
                        console.log("src="+src);
                        file.getImageSizeByUrl(src, (err, obj1) => {
                            //console.log(" obj width="+obj1.width);
                            let obj = {
                                url,
                                desc,
                                title,
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
                desc: "Bad Link",
                title: 'NA',
                wechaturl:'NA',
                obj1:'NA'
            };
            cb(null, obj);
        }
    });
};

const runTask = (urlArr, cb) => {
    async.map(urlArr, fetchTrans, (err, res) => {
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
</style>
    <table>
    <tr>
                <th>URL</th>
                <th>Description</th>
                <th>OG Description</th>
                <th>Title</th>
                <th>OG Title</th>
            </tr>
    `;

    content.forEach(item => {
        finalStr += `
            <tr>
                <td><a href="${item.url}">${item.url}</a></td>
                <td${item.desc.length > 50 ? " class='red'" : ""}>${item.desc}</td>
                <td${item.ogDesc.length > 150 ? " class='red'" : ""}>${item.ogDesc}</td>
                <td>${item.title}</td>
                <td>${item.ogTitle}</td>
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
                    desc: 'Description',
                    ogDesc: 'OG Description',
                    title: 'Title',
                    ogTitle: 'OG Title',
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