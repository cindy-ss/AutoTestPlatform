/**
 * Created by edel.ma on 6/28/17.
 */

const cheerio = require('cheerio'),
    async = require('async');

const query = require('../service/query'),
    util = require('../service/util');

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
            <th>OG Img label</th>
            <th>OG Img URL Server</th>
            <th>WeChat Img</th>
            <th>WeChat URL</th>
        </tr>
        ${content.map(item => `
            <tr>
                <td><div><a href="${item.url}" target="_blank">${item.url}</a></div></td>
                <td><div>${item.title}</div></td>
                <td${item.desc && (item.desc.length > 150 || item.desc.length < 100) ? " class='red'" : ""}><div>${item.desc}</div></td>
               
                <td><div>${item.ogTitle}</div></td>
                <td${item.ogDesc && (item.ogDesc.length > 150 || item.ogDesc.length < 100) ? " class='red'" : ""}><div>${item.ogDesc}</div></td>
                <td class="text-center"><div><img src="${item.ogImage.url}" alt="ogImage" class="ext-thumb"><br>
                Width:${item.ogImage.size.width}.Hight:${item.ogImage.size.height}</div></td>
                <td><div><a href="${item.oglab}" target="_blank">${item.oglab}</a></div></td>
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

const exporter = (data, cb) => {
    dealHTML(data, cb);
};

exports.runTask = runTask;
exports.exporter = exporter;