/**
 * Created by edel.ma on 7/28/17.
 */

const font = require('../service/font'),
    gh = require('../service/geo_helper');

exports.checkByUrl = (url, auth, option, cb) => {
    let geo = gh.getGEO(url);
    if (geo === 'MO') {
        geo = 'TW';
    }
    option = option || {};
    option['geo'] = (option['geo'] || geo).toLowerCase();
    font.checkByUrl(url, auth, option, (err, data) => {
        cb(err, {
            url: url,
            data: data
        });
    });
};

exports.check = (content, option) => {
    return font.check(content, option);
};