/**
 * Created by edel.ma on 7/10/17.
 */

const cheerio = require('cheerio'),
    URL = require('url'),
    path = require('path');

const basic = require('./basic'),
    util = require('./util');

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

    let matched = content.match(/[a-z0-9A-Z_\:\/\.\-]*\.mp4/g) || [];

    matched.forEach(item => {
        res.push(item);
    });

    cb(null, res);
};

const bgHandler = (content, url, cb) => {
    let res = [];
    if (content) {
        let matched = content.toString().match(/url\(\"[a-z0-9A-Z_\:\/\.\-]*\"\)/g);
        if (matched) {
            matched.forEach(item => {
                const tempUrl = item.substr(5, item.length - 7);

                const filterArr = (basic.conf['image-checker'] || {})['filterRegs'] || [];

                let filter = (basic.conf['image-checker'] || {})['filter'] || [];

                let filterPathArr = (basic.conf['image-checker'] || {})['filterPathRegs'] || [];

                if (filter.indexOf(path.basename(tempUrl)) === -1 && util.filter(path.basename(tempUrl), filterArr) && util.filter(tempUrl, filterPathArr)) {
                    res.push(URL.resolve(url, tempUrl));
                } else {
                    console.log(`we popped a url : ${tempUrl}`);
                }
            });
        }
        cb(null, res);
    } else {
        cb(new Error('No Content Provided'), res);
    }
};

const imageHandler = (content, cb) => {
    let res = [];
    try {
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
    }
    catch (e) {
        cb(e, res);
    }
};

const cssHandler = (content, url, cb, filter) => {
    filter = filter || [];
    let res = [];
    try {
        const $ = cheerio.load(content);

        const arr = $("link[rel='stylesheet']");

        arr.each((i, item) => {
            if (item.attribs && item.attribs.href) {
                let tempUrl = item.attribs.href;

                const filterArr = (basic.conf['css-checker'] || {})['filterRegs'] || [];

                if (util.filter(tempUrl, filterArr)) {
                    const tempResolvedUrl = URL.resolve(url, tempUrl);
                    if (filter.indexOf(tempResolvedUrl) === -1) {
                        res.push({
                            tag: 'css',
                            url: tempResolvedUrl
                        });
                    }
                }
            }
        });
        cb(null, res);
    }
    catch (e) {
        cb(e, res);
    }
};

// const attachHandler = (content, cb) => {
//     let res = [];
//     try {
//         const $ = cheerio.load(content);
//
//         const cssArr = $("link[rel='stylesheet']");
//
//         cssArr.each((i, item) => {
//             if (item.attribs && item.attribs.href && item.attribs.href.indexOf('/v/') !== -1) {
//                 res.push(item.attribs.href);
//             }
//         });
//
//         const jsArr = $("script");
//
//         jsArr.each((i, item) => {
//             if (item.attribs && item.attribs.src && item.attribs.src.indexOf('/v/') !== -1) {
//                 res.push(item.attribs.src);
//             }
//         });
//
//         cb(null, res);
//     }
//     catch (e) {
//         cb(e, res);
//     }
// };

const attachHandler = (content, cb) => {
    let res = [];

    let matched = content.match(/.*\/v\/.*/g) || [];

    matched.forEach(item => {
        res.push(item);
    });

    cb(null, res);
};

const wechatHandler = (content, cb) => {
    try {
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
    } catch (e) {
        cb(e, null);
    }


};

const linkHandler = (content, cb) => {
    let res = [];
    try {
        const $ = cheerio.load(content);
        const linkArr = $("a");

        linkArr.each(function (i, item) {
            if (item.attribs && item.attribs.href) {
                let tempUrl = item.attribs.href;
                res.push(tempUrl);
            }
        });
        cb(null, res);
    } catch (e) {
        cb(e, res);
    }
};

exports.videoHandler = videoHandler;
exports.imageHandler = imageHandler;
exports.attachHandler = attachHandler;
exports.mp4Handler = mp4Handler;
exports.wechatHandler = wechatHandler;
exports.bgHandler = bgHandler;
exports.cssHandler = cssHandler;
exports.linkHandler = linkHandler;