/**
 * Created by edel.ma on 7/10/17.
 */

const font = require('./font');

const fs = require('fs');

let conf;

exports.init = (cb) => {
    font.init(cb);

    conf = JSON.parse(fs.readFileSync('./server/conf.json', "utf-8"));
};

exports.conf = conf;