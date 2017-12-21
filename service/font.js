/**
 * Created by edel.ma on 7/17/17.
 */

const q = require('./query'),
    fontkit = require('fontkit'),
    fs = require('fs'),
    async = require('async'),
    path = require('path'),
    cheerio = require('cheerio'),
    later = require('later');

let basic = require('./basic');

let metrics, avoid;
const prefix = '/wss/fonts/', params = ['geo', 'name', 'type', 'server'];

const getAvailableFontType = () => {
    // return metrics.map(({name}) => {return name;});
    return metrics;
};

const init = (cb) => {
    basic.log('[ √ ] : Start font checking.');
    let rawConf = fs.readFileSync('./font/conf.json', 'utf-8');
    let conf = JSON.parse(rawConf);
    metrics = conf['font'];
    avoid = conf['avoid'];

    async.each(metrics, (item, callback) => {
        try {
            fs.statSync(`./font/${item.server}-${path.basename(item.url)}`);
            callback(null);
        }
        catch (e) {
            q.bareQuery(`${item.server === 'WWW' ? 'http://www.apple.com' : 'https://webfonts.iapps.apple.com'}${prefix}${item.url}`, (err, res, data) => {
                fs.writeFileSync(`./font/${item.server}-${path.basename(item.url)}`, data);
                if (err) {
                    console.log(err);
                }
                callback(err);
            }, {}, {
                encoding: null,
                headers: {
                    referer: 'https://www.apple.com/hk/index.html',
                    origin: 'https://www.apple.com/hk/index.html'
                }
            });
        }
    }, err => {
        basic.log('[ √ ] : Font files checked.');
        cb();
    });

    // let textSched = later.parse.recur().every(1).dayOfMonth();
    // const timer = later.setInterval(fetch, textSched);
};

const fetch = () => {
    basic.log('[ √ ] : Loading font files from server.');

    async.each(metrics, (item, callback) => {
        q.bareQuery(`${item.server === 'WWW' ? 'http://www.apple.com' : 'https://webfonts.iapps.apple.com'}${prefix}${item.url}`, (err, res, data) => {
            fs.writeFileSync(`./font/${item.server}-${path.basename(item.url)}`, data);
            if (err) {
                console.log(err);
            }
            callback(err);
        }, {}, {
            encoding: null,
            headers: {
                referer: 'https://www.apple.com/hk/index.html',
                origin: 'https://www.apple.com/hk/index.html'
            }
        });
    }, err => {
        basic.log('[ √ ] : Font files load complete.');
    });
};

const check = (data, option) => {
    option = option || {};
    // option['server'] = "WWW";


    data = data.replace(/ /g, "").replace(/\n/g, "").replace(/\t/g, "").replace(/[a-z0-9A-Z]/g, '');

    let res = {};
    let srcArr = [];
    if (option) {
        let filter = [];
        for (let i of params) {
            if (option[i]) {
                filter.push(i);
            }
        }

        metrics.forEach(item => {
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

//console.log(srcArr);
    srcArr.forEach(item => {
        res[item.name] = [];
        let tempArr = res[item.name];
        const font = fontkit.openSync(`./font/${item.server}-${path.basename(item.url)}`);

        for (let i of data) {
            const code = i.charCodeAt(0);
            const codeStr = i.charCodeAt(0).toString(16);
            if (font.characterSet.indexOf(code) === -1 && codeStr.length > 2 && avoid.indexOf(codeStr) === -1 && !tempArr.find(item => {
                    return item.word === i
                })) {
                tempArr.push({
                    word: i,
                    code: codeStr
                });
            }
        }
    });

    return res;
};

const checkByUrl = (url, auth, option, cb) => {
    q.query(url, (err, data) => {
        try {
            const $ = cheerio.load(data);
            const text = $("body").text();


            cb(err, check(text, option));
        }
        catch (e) {
            cb(e);
        }
    }, auth)
};

exports.init = init;
exports.check = check;
exports.fetch = fetch;
exports.checkByUrl = checkByUrl;
exports.getAvailableFontType = getAvailableFontType;