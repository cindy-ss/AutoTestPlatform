const adapter = require('../service/adapter'),
    q = require('../service/query'),
    util = require('../service/util');

const URL = require("url");

const getLinks = (url, auth, cb) => {
    url = util.urlNormalize(url);
    q.query(url, (err, data) => {
        if (!err) {
            adapter.linkHandler(data, (err, arr) => {
                if (!err) {
                    let res = [];
                    arr.forEach(item => {
                        res.push(URL.resolve(url, item));
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

exports.getLinks = getLinks;