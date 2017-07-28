/**
 * Created by edel.ma on 7/28/17.
 */

const async = require('async');

const font = require('../service/font');

exports.checkByUrl = (url, auth, option, cb) => {
    font.checkByUrl(url, auth, option, cb);
};

exports.check = (content, option) => {
    return font.check(content, option);
};