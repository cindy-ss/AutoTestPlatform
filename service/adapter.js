/**
 * Created by edel.ma on 7/10/17.
 */

const cheerio = require('cheerio'),
    URL = require('url');

const REG = {
    MP4: new RegExp(/\.mp4$/)
};

const videoHandler = (content, cb) => {
    let res = [];
    const $ = cheerio.load(content);

    const arr = $("video");

    arr.each((i, item) => {
        console.log(item);
    });

    cb(null, res);
};

const mp4Handler = (content, cb) => {
    let res = [];

    let matched = content.match(/[a-z0-9A-Z_\:\/\.\-]*\.mp4/g);

    matched.forEach(item => {
        res.push(item);
    });

    cb(null, res);
};

const bgHandler = (content, url, cb) => {
    let res = [];
    if (content) {
        let matched = content.toString().match(/url\(\"[a-z0-9A-Z_\:\/\.\-]*\"\)/g);
        if(matched){
            matched.forEach(item => {
                const tempUrl = item.substr(5, item.length - 7);
                res.push(URL.resolve(url, tempUrl));
            });
        }
        cb(null, res);
    } else {
        cb(new Error('No Content Provided'), res);
    }
};

const imageHandler = (content, cb) => {
    let res = [];
    const $ = cheerio.load(content);

    const arr = $("img");

    arr.each((i, item) => {
        if (item.attribs && item.attribs.src) {
            let tempUrl = item.attribs.src;
            res.push({
                tag: 'img',
                url: tempUrl
            });
        }
    });

    cb(null, res);
};

const cssHandler = (content, url, cb) => {
    let res = [];
    const $ = cheerio.load(content);

    const arr = $("link[rel='stylesheet']");

    arr.each((i, item) => {
        if (item.attribs && item.attribs.href) {
            let tempUrl = item.attribs.href;
            if (tempUrl.indexOf('ac-globalnav.built.css') === -1 && tempUrl.indexOf('ac-globalfooter.built.css') === -1 && tempUrl.indexOf('ac-localnav.built.css') === -1 && tempUrl.indexOf('fonts?') === -1) {
                res.push({
                    tag: 'css',
                    url: URL.resolve(url, tempUrl)
                });
            }
        }
    });

    cb(null, res);
};

const fontHandler = (content, cb) => {
    let res = [];
    const $ = cheerio.load(content);

    const arr = $("video");

    arr.each((i, item) => {
        console.log(item);
    });

    cb(null, res);
};

const wechatHandler = (content, cb) => {
    const $ = cheerio.load(content);

    const div = $('body > div');

    let url = null;

    if (div && div.css('display') === 'none') {
        const img_wechat = $('body > div > img')[0];
        const img_first = $('img')[0];

        if (
            img_wechat && img_wechat.attribs
            &&
            img_first && img_first.attribs
            &&
            img_wechat.attribs.src === img_first.attribs.src
        ) {
            url = img_wechat.attribs.src;
        }
    }

    cb(null, url);
};

exports.videoHandler = videoHandler;
exports.imageHandler = imageHandler;
exports.fontHandler = fontHandler;
exports.mp4Handler = mp4Handler;
exports.wechatHandler = wechatHandler;
exports.bgHandler = bgHandler;
exports.cssHandler = cssHandler;