/**
 * Created by edel.ma on 7/17/17.
 */

const q = require('./query'),
    fontkit = require('fontkit'),
    fs = require('fs'),
    async = require('async'),
    path = require('path');

const metrics = [
        {
            url : 'SF-Pro-SC/v1/PingFangSC-Regular.woff2',
            geo : 'cn',
            type : 'woff2',
            name : 'SF_SC_WOFF2',
            weight : 400,
            path : './font/PingFangSC-Regular.woff2'
        }
    ],
    prefix = '/wss/fonts/';

const getAvailableFontType = () => {
    // let arr = [];
    // metrics.forEach((item, index) => {arr.push(item.name)});
    // return arr;
    return metrics;
};

const init = (cb) => {
    async.each(metrics, (item, callback) => {
        q.bareQuery(`http://www.apple.com${prefix}${item.url}`, (err, res, data) => {
            fs.writeFileSync(item.path, data);
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
    let filter = [];
    if(option){
        for(let i of metrics[0]){
            if(option[i]){
                filter.push(i);
            }
        }
        metrics.forEach((item, index) => {
            let flag = true;
            for(let i of filter){
                flag = flag && (item[i] === option[i]);
            }
            if(flag){
                srcArr.push(item)
            }
        });
    }else{
        srcArr = metrics;
    }

    srcArr.forEach((item, index) => {
        res[item.name] = [];
        const font = fontkit.openSync(item.path);

        for (let i of data) {
            if (font.characterSet.indexOf(i.charCodeAt(0)) === -1) {
                res[item.name].push({
                    word : i,
                    code : i.charCodeAt(0).toString(16)
                });
            }
        }
    });


    return res;
};

const checkByUrl = (url, option, cb) => {
    q.query(url, (err, data) => {
        const $ = cheerio.load(data);
        const text = $("body").text();

        cb(err, check(text));
    })
};

function parse(b, a) {
    var c = new XMLHttpRequest();
    c.open("GET", b, true);
    c.responseType = "arraybuffer";
    c.onreadystatechange = function () {
        if (c.readyState == 4 && c.status == 200) {
            opentype.parse(this.response);
            progress++;
            if (a == 101) {
                cnTradArray = glyphArray;
            } else if (a == 201) {
                hkTradArray = glyphArray;
            } else if (a == 301) {
                twTradArray = glyphArray;
            } else if (a == 102) {
                cnHanHeiArray = glyphArray;
            } else if (a == 202) {
                hkHanHeiArray = glyphArray;
            } else if (a == 302) {
                twHanHeiArray = glyphArray;
            } else if (a == 103) {
                cnSFArray = glyphArray;
            } else if (a == 203) {
                hkSFArray = glyphArray;
            } else if (a == 303) {
                twSFArray = glyphArray;
            } else if (a == 401) {
                usMyriadArray = glyphArray;
            } else if (a == 403) {
                usSFDisplayArray = glyphArray;
            } else if (a == 99902) {
                usSFIconsArray = glyphArray;
            }
            if (progress === 12) {
                fontArrayData = {
                    'zh-CN': {'PingHei': cnTradArray, 'HanHei': cnHanHeiArray, 'SF': cnSFArray},
                    'zh-HK': {'MHei': hkTradArray, 'HanHei': hkHanHeiArray, 'SF': hkSFArray},
                    'zh-TW': {'MHei': twTradArray, 'HanHei': twHanHeiArray, 'SF': twSFArray},
                    'en-US': {'myriad': usMyriadArray, 'SF': usSFDisplayArray},
                    'ja-JP': {},
                    'ko-KR': {},
                    'zh-MO': {'trad': hkTradArray, 'hanhei': hkHanHeiArray, 'sf': hkSFArray},
                    'ar-AE': {'gulf': []},
                    'ICONS': {'icons': usSFIconsArray}
                };
            }
        }
    };
    c.send()
}

exports.init = init;
exports.check = check;
exports.checkByUrl = checkByUrl;
exports.getAvailableFontType = getAvailableFontType;