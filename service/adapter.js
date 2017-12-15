/**
 * Created by edel.ma on 7/10/17.
 */

const cheerio = require('cheerio'),
    URL = require('url'),
    path = require('path');

const basic = require('./basic'),
    util = require('./util');

const imageCheckerConf = require('../server/config/image_checker').config || {},
    cssCheckerConf = require('../server/config/css_checker').config || {};

const videoHandler = (content, cb) => {
    let res = [];
    const $ = cheerio.load(content);

    const arr = $("video");

    arr.each((i, item) => {
        console.log(item);
    });

    cb(null, res);
};

const viewportHandler = (content) => {
    return content.indexOf('viewport-fit=cover') !== -1;
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
            //不匹配地址的結果數組，用於紀錄所有不匹配結果的數量。
            let unmatchedArr = [];

            matched.forEach(item => {
                const tempUrl = item.substr(5, item.length - 7);

                const filterArr = imageCheckerConf['filterRegs'] || [];

                let filter = imageCheckerConf['filter'] || [];

                let filterPathArr = imageCheckerConf['filterPathRegs'] || [];

                if (filter.indexOf(path.basename(tempUrl)) === -1 && util.filter(path.basename(tempUrl), filterArr) && util.filter(tempUrl, filterPathArr)) {
                    res.push(URL.resolve(url, tempUrl));
                } else {
                    unmatchedArr.push(tempUrl);
                    basic.log(`\t[ ! ] : Image checker adapter has filtered a url : ${tempUrl}.`, 'D');
                }
            });

            basic.log(`\t[ ! ] : Totally ${unmatchedArr.length} urls have been filtered.`, 'S')
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

        const filterArr = cssCheckerConf['filterRegs'] || [];

        arr.each((i, item) => {
            if (item.attribs && item.attribs.href) {
                let tempUrl = item.attribs.href;

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
        item = item.replace(/\t/g, '').replace(/\n/g, '');
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

        // linkArr.each(function (i, item) {
        //     if (item.attribs && item.attribs.href) {
        //         let tempUrl = item.attribs.href;
        //
        //         res.push(tempUrl);
        //     }
        // });


        linkArr.each(function (i, item) {
            if (item.attribs && item.attribs.href) {
                let objUrl = {
                    tempUrl: item.attribs.href,
                    text: $(this).text()
                };

                res.push(objUrl);
            }
        });

        cb(null, res);
    } catch (e) {
        cb(e, res);
    }
};

const footNoteHandler = content => {
    let res = {
        'irrelevance': [],
        'data': []
    };
    try {
        const $ = cheerio.load(content);
        const supArr = $("sup");

        const ulArr = $('.ac-gf-sosumi ul li');
        const olArr = $('.ac-gf-sosumi ol li');

        let footNoteObj = {};

        ulArr.each((i, item) => {
            let text = $(item).text();
            let mark = null;
            if (new RegExp(/[*†]/).test(text[0])) {
                mark = text.split(' ')[0];
                let tempText = text.substr(mark.length);
                if (footNoteObj[mark]) {
                    console.log(`[ ERR ]`);
                } else {
                    footNoteObj[mark] = {
                        footnote: tempText,
                        copy: [],
                    }
                }
            } else {
                res['irrelevance'].push(text)
            }
        });

        olArr.each((index, item) => {
            footNoteObj[index + 1] = {
                footnote: $(item).text(),
                copy: [],
            };
        });

        supArr.each(function (i, item) {
            let mark = $(item).text().replace(/footnote/g, '').replace(/ /g, '');
            let text;
            if ($(item).parent().text().length < 10) {
                if ($(item).parent().parent().text().length > 20) {
                    let parent = $(item).parent().text();
                    let grandParent = $(item).parent().parent().text();

                    let pos = grandParent.indexOf(parent) + parent.length;

                    text = grandParent.substr(pos > 20 ? pos - 20 : 0, 20);
                } else {
                    text = $(item).parent().parent().text();
                }
            } else {
                text = $(item).parent().text();
            }

            text = text.replace(/\t/g, '').replace(/\n/g, '');

            if (new RegExp(/\d/).test(mark)) {
                mark = parseInt(mark).toString();
            }

            footNoteObj[mark] = footNoteObj[mark] || {
                footnote: '',
                copy: []
            };

            footNoteObj[mark]['copy'].push(text);
        });

        for (let i in footNoteObj) {
            res['data'].push({
                mark: i,
                footnote: footNoteObj[i]['footnote'],
                copy: footNoteObj[i]['copy']
            })
        }

        return res;
    } catch (e) {
        console.log(`[ERR]:${e}`);
        return res;
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
exports.viewportHandler = viewportHandler;
exports.footNoteHandler = footNoteHandler;