/**
 * Created by edel.ma on 7/28/17.
 */

const async = require('async');

const font = require('../service/font'),
    gh = require('../service/geo_helper');

exports.checkByUrl = (urls, auth, option, cb) => {
    let res = [];
    async.each(urls, (item, callback) => {
        let geo = gh.getGEO(item);
        if(geo === 'MO'){
            geo = 'TW';
        }
        option = option || {};
        option['geo'] = option['geo'].toLowerCase() || geo.toLowerCase();
        font.checkByUrl(item, auth, option, (err, data) => {
            if (!err) {
                res.push({
                    url: item,
                    data: data
                });
            }
            callback(err);
        });
    }, err => {
        cb(err, res);
    });
};

exports.check = (content, option) => {
    return font.check(content, option);
};