/**
 * Created by edel.ma on 6/28/17.
 */

const cheerio = require('cheerio'),
    async = require('async');

const query = require('../service/query'),
    util = require('../service/util'),
    fs = require('fs');

const fetchTrans = (url, auth, cb) => {
    url = util.urlNormalize(url);

    query.query(url, (err, res) => {
        if (!err) {
            let $, obj;
            try {
                $ = cheerio.load(res);
            }
            catch (e) {
                console.log(`\t[ X ] : Load response from ${url} failed, messages: ${e.message}`);
                $ = null;
            }

            if ($) {
                let viewport = $("meta[name='viewport']").attr('content');

                console.log(viewport);

                let obj = {
                    url,
                    flag: viewport === 'width=device-width, initial-scale=1, viewport-fit=cover',
                    viewport
                };

                cb(null, obj);
            } else {
                obj = {
                    url,
                    flag: false,
                    viewport: ''
                };
                cb(null, obj);
            }
        } else {
            console.log(`\t[ X ] : Querying data from ${url} failed, with an error of ${err.message}`);
            let obj = {
                url,
                flag: false,
                viewport: ''
            };
            cb(null, obj);
        }
    }, auth);
};

const runTask = (urlStr, auth, cb) => {
    let urlArr = urlStr.split('\n');
    async.map(urlArr, (item, callback) => {
        fetchTrans(item, auth, (err, data) => {
            if (err) {
                console.log(`\t[ X ] : Doing viewport check failed on ${item}`);
            }
            callback(null, data);
        })
    }, (err, res) => {
        cb(res);
    });
};

const dealHTML = (content, cb) => {
    content = JSON.parse(content);
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
    <caption align="top">ViewPort Report</caption> 
    <tbody class="metaStyle">
        <tr>
            <th>URL</th>
            <th>ViewPort</th>
            <th>Result</th>
        </tr>
        ${content.map(item => `
            <tr>
               <td><a href="${item.url}" target="_blank">${item.url}</a></td>
               <td>${item.viewport}</td>
               <td ${(item.flag == false ) ? " class='red'" : ""}>${item.flag}</td>
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

const exporter = (data, cb) => {
    dealHTML(data, cb);
};

exports.runTask = runTask;
exports.exporter = exporter;