/**
 * Created by edel.ma on 6/28/17.
 */

const cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs'),
    excel = require('json2excel'),
    mustache = require('mustache');

const query = require('../service/query');

const fetchTrans = (url, auth, cb) => {
    query.query(url, (err, res) => {
        if (!err) {
            const $ = cheerio.load(res);
            let desc = $("meta[name='Description']").attr('content');

            let ogDesc = $("meta[property='og:description']").attr('content');

            let ogTitle = $("meta[property='og:title']").attr('content');

            let title = $("title").text();

            // let p = URL.parse(url);

            // const URL = require('url');

            let obj = {
                url,
                title,
                desc,
                ogTitle,
                ogDesc,

            };

            cb(err, obj);


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
            dealHTMLWithMustache(obj.xls, cb);
            break;
        default:
            dealExcel(obj.xls, cb);
    }
};

exports.runTask = runTask;
exports.export2Xls = export2Xls;