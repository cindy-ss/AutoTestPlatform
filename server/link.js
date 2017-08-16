const adapter = require('../service/adapter'),
    q = require('../service/query'),
    util = require('../service/util'),
    basic = require('../service/basic'),
    gh = require('../service/geo_helper');

const URL = require("url");

const getLinks = (url, auth, cb) => {
    url = util.urlNormalize(url);
    const geo = gh.getGEO(url);
    q.query(url, (err, data) => {
        if (!err) {
            adapter.linkHandler(data, (err, arr) => {
                if (!err) {
                    let res = [];
                    arr.forEach(item => {
                        res.push(judgeUrl(url, item, geo))
                    });
                    cb(null, res);
                } else {
                    cb(err);
                }
            });
        } else {
            cb(err);
        }
    }, auth, {});
};

const judgeUrl = (origin, url, geo) => {
    let tempUrl = URL.resolve(origin, url);
    let obj = {
        type: null,
        href: tempUrl,
        status: null,
        message: null,
        rawLink: url
    };

    let host = URL.parse(tempUrl).hostname;

    const conf = basic.conf['link-checker'] || {};
    const filter = conf['filter'] || [];
    const deformity = conf['deformity'] || [];
    const hostDiff = conf['hostDiff'] || [];

    if (!util.filter(host, filter)) {
        obj.type = 'blacklist';
        obj.status = 'omit';
    } else if (!util.filter(host, deformity)) {
        obj.type = 'deformity';
        obj.status = 'omit';
    } else if (!util.filter(host, hostDiff)) {
        obj.type = 'hostDiff';
        if (gh.isGEO(tempUrl, geo)) {
            obj.status = 'pass';
        } else {
            obj.status = 'failed';
            obj.message = `No GEO string ${geo} Required for ${url}`;
        }
    } else {
        obj.type = 'normal';
        if (gh.isGEO(tempUrl, geo)) {
            obj.status = 'pass';
        } else {
            obj.status = 'failed';
            obj.message = `No GEO string ${geo} Required for ${url}`;
        }
    }

    return obj;
};

exports.getLinks = getLinks;