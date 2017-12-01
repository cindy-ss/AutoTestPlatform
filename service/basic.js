/**
 * Created by edel.ma on 7/10/17.
 */

const font = require('./font');

const fs = require('fs');

const dirList = ['./static/data/', './tmp/'];

exports.init = (cb) => {
    dirList.forEach(url => {
        try {
            fs.statSync(url)
        }
        catch (e) {
            fs.mkdirSync(url)
        }
    });

    this.conf = JSON.parse(fs.readFileSync('./server/conf.json', "utf-8"));

    // font.init(() => {
        cb();
    // });
};

exports.log = function (obj) {
    console.log(obj);
};

exports.conf = this.conf;