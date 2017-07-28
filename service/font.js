/**
 * Created by edel.ma on 7/17/17.
 */

const q = require('./query'),
    fontkit = require('fontkit'),
    fs = require('fs'),
    async = require('async'),
    path = require('path'),
    cheerio = require('cheerio');

const metrics = [
        {
            url: 'SF-Pro-SC/v1/PingFangSC-Regular.woff2',
            geo: 'cn',
            type: 'woff2',
            name: 'SF_SC_WOFF2',
            cate: 'sf'
        }
    ],
    prefix = '/wss/fonts/';

const getAvailableFontType = () => {
    // return metrics.map(({name}) => {return name;});
    return metrics;
};

const init = (cb) => {
    async.each(metrics, (item, callback) => {
        q.bareQuery(`http://www.apple.com${prefix}${item.url}`, (err, res, data) => {
            fs.writeFileSync(`./font/${path.basename(item.url)}`, data);
            callback(err);
        }, {}, {
            encoding: null
        });
    }, err => {
        cb(err);
    });
};

const check = (data, option) => {
    data = data.replace(/ /g, "").replace(/\n/g, "").replace(/\t/g, "").replace(/[a-z0-9A-Z]/g, '');
    let res = {};
    let srcArr = [];
    if (option) {
        let filter = [];
        for (let i of metrics[0]) {
            if (option[i]) {
                filter.push(i);
            }
        }
        metrics.forEach((item, index) => {
            let flag = true;
            for (let i of filter) {
                flag = flag && (item[i] === option[i]);
            }
            if (flag) {
                srcArr.push(item)
            }
        });
    } else {
        srcArr = metrics;
    }

    srcArr.forEach((item, index) => {
        res[item.name] = [];
        const font = fontkit.openSync(`./font/${path.basename(item.url)}`);

        for (let i of data) {
            if (font.characterSet.indexOf(i.charCodeAt(0)) === -1) {
                res[item.name].push({
                    word: i,
                    code: i.charCodeAt(0).toString(16)
                });
            }
        }
    });

    return res;
};

const checkByUrl = (url, auth, option, cb) => {
    q.query(url, (err, data) => {
        const $ = cheerio.load(data);
        const text = $("body").text();

        cb(err, check(text, option));
    }, auth)
};

exports.init = init;
exports.check = check;
exports.checkByUrl = checkByUrl;
exports.getAvailableFontType = getAvailableFontType;