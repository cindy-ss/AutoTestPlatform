/**
 * Created by edel.ma on 6/28/17.
 */

const cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs'),
    excel = require('json2excel'),
    mustache = require('mustache');

const query = require('../service/query');
const URL = require('url');
const adapter = require('../service/adapter');
const sizeOf = require('image-size');
const file = require('../service/file');

const fetchTrans = (url, auth, cb) => {
    query.query(url, (err, res) => {
        if (!err) {
            const $ = cheerio.load(res);
            let desc = $("meta[name='Description']").attr('content');

            let ogDesc = $("meta[property='og:description']").attr('content');

            let ogTitle = $("meta[property='og:title']").attr('content');

            let ogImage = $("meta[property='og:image']").attr('content');

            let title = $("title").text();

            let p = URL.parse(url);

            adapter.wechatHandler(res, (err, res1) => {
                if(!err){
                    if (res1==null){
                        console.log("null");
                        file.getImageSizeByUrl(ogImage, (err, ogsize) => {
                            let obj = {
                                url,
                                desc,
                                title,
                                ogTitle,
                                ogDesc,
                                ogImage,
                                wechaturl:"No WeChat Img",
                                obj1:"NA",
                                ogsize

                            };
                        })

                        cb(err, obj);

                    }else{
                        let wechaturl = p.protocol + "//" + p.hostname + res1;
                        file.getImageSizeByUrl(wechaturl, (err, obj1) => {
                            file.getImageSizeByUrl(ogImage, (err, ogsize) => {
                                let obj = {
                                    url,
                                    title,
                                    desc,
                                    ogTitle,
                                    ogDesc,
                                    ogImage,
                                    wechaturl,
                                    obj1,
                                    ogsize

                                };
                                cb(err, obj);
                            })
                        });

                    }
                }

            });



        } else {
            console.log(err);
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

const dealHTMLWithMustache = (content, cb) => {
    const temp = fs.readFileSync('./server/templates/meta.mst', 'utf-8');
    const exportTime = new Date().getTime();
    const title = `report-${exportTime}`;
    const exportPath = `./static/data/${title}.html`;
    const obj = {
        title,
        content
    };
    const res = mustache.render(temp, obj);
    fs.writeFileSync(exportPath, res, 'utf-8');

    cb(null, exportTime);
};

const dealHTML = (content, cb) => {
    const exportTime = new Date().getTime();
    const title = `report-${exportTime}`;
    const exportPath = `./static/data/${title}.html`;

    let finalStr = `
<style>
.red {
color : red;
}
</style>
    <table>
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
                <td><a href="${item.url}">${item.url}</a></td>
                <td>${item.title}</td>
                <td${item.desc.length > 150 ? " class='red'" : ""}>${item.desc}</td>
                <td>${item.ogTitle}</td>
                <td${item.ogDesc.length > 150 ? " class='red'" : ""}>${item.ogDesc}</td>
                <td class="text-center"><img src="${item.ogImage}" alt="ogImage" class="ext-thumb"><br>
                     Width:${item.ogsize.width}.Hight:${item.ogsize.height}</td>
                <td>${item.ogImage} </td>
                <td class="text-center"><img src="${item.wechaturl}" alt="wachatImage" class="ext-thumb"><br>
                     <br>
                     Width:${item.obj1.width}.Hight:${item.obj1.height}</td>
                <td>${item.wechaturl}</td>
               
            </tr>
            `;
    });

    finalStr += "</table>";

    fs.writeFileSync(exportPath, finalStr, 'utf-8');

    cb(null, exportTime);
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