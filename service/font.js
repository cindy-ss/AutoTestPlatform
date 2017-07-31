/**
 * Created by edel.ma on 7/17/17.
 */

const q = require('./query'),
    fontkit = require('fontkit'),
    fs = require('fs'),
    async = require('async'),
    path = require('path'),
    cheerio = require('cheerio');

let metrics, avoid;
const prefix = '/wss/fonts/', params = ['geo', 'name', 'type', 'server'];

const getAvailableFontType = () => {
    // return metrics.map(({name}) => {return name;});
    return metrics;
};

const init = (cb) => {
    let rawConf = fs.readFileSync('./font/conf.json', 'utf-8');
    let conf = JSON.parse(rawConf);
    metrics = conf['font'];
    avoid = conf['avoid'];

    async.each(metrics, (item, callback) => {
        q.bareQuery(`${item.server === 'WWW' ? 'http://www.apple.com' : 'http://webfonts.iapps.apple.com/'}${prefix}${item.url}`, (err, res, data) => {
            fs.writeFileSync(`./font/${item.server}-${path.basename(item.url)}`, data);
            if(err){console.log(err);}
            callback(err);
        }, {}, {
            encoding: null
        });
    }, err => {
        cb(err);
    });
};

const check = (data, option) => {
    option = option || {};
    option['server'] = "WWW";
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

    srcArr.forEach(item => {
        res[item.name] = [];
        let tempArr = res[item.name];
        const font = fontkit.openSync(`./font/${item.server}-${path.basename(item.url)}`);

        for (let i of data) {
            const code = i.charCodeAt(0);
            const codeStr = i.charCodeAt(0).toString(16);
            if (font.characterSet.indexOf(code) === -1 && codeStr.length > 2 && avoid.indexOf(codeStr) === -1 && !tempArr.find(item => {return item.word === i})) {
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
        const $ = cheerio.load(data);
        const text = $("body").text();

        cb(err, check(text, option));
    }, auth)
};

exports.init = init;
exports.check = check;
exports.checkByUrl = checkByUrl;
exports.getAvailableFontType = getAvailableFontType;