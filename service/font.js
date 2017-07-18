/**
 * Created by edel.ma on 7/17/17.
 */

const q = require('./query'),
    fontkit = require('fontkit'),
    fs = require('fs'),
    async = require('async');

const srcArr = ['PingHei/v1/PingHei-light.woff'],
    prefix = '/wss/fonts/';

const init = (cb) => {
    async.each(srcArr, (item, callback) => {
        q.bareQuery(`http://www.apple.com${prefix}${item}`, (err, res, data) => {
            fs.writeFileSync('./font.woff', data);
            callback(err);
        }, {
            encoding: null
        });
    }, err => {
        cb();
    });
};

const check = (data) => {
    let resArr = [];
    const font = fontkit.openSync('./font.woff');

    for(let i of data){
        if(font.characterSet.indexOf(i.charCodeAt(0)) === -1){
            resArr.push(i.charCodeAt(0).toString(16));
        }
    }

    return resArr;
};

const checkByUrl = (url, cb) => {
    q.query(url, (err, data) => {
        const $ = cheerio.load(data);
        const text = $("body").text().replace(/ /g, "").replace(/\n/g, "").replace(/\t/g, "");

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