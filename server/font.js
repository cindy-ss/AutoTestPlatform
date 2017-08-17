/**
 * Created by edel.ma on 7/28/17.
 */

const font = require('../service/font'),
    gh = require('../service/geo_helper'),
    async = require('async'),
    util = require("../service/util");

exports.checkByUrl = (url, auth, option, cb) => {
    if (!util.isArray(url)) {
        try {
            url = JSON.parse(url);
        } catch (e) {
            cb(e, {
                url: url,
                data: []
            })
        }
    }

    let res = [];

    async.eachLimit(url, 5, (item, callback) => {
        let geo = gh.getGEO(item);
        if (geo === 'MO') {
            geo = 'TW';
        }
        option = option || {};
        option['geo'] = (option['geo'] || geo).toLowerCase();
        font.checkByUrl(item, auth, option, (err, data) => {
            res.push({
                url: item,
                data: data
            });
            console.log(`\t[ X ] : error while parsing ${item}`);
            callback(null);
        });
    }, (err) => {
        cb(err, res);
    });

};

exports.check = (content, option) => {
    return font.check(content, option);
};