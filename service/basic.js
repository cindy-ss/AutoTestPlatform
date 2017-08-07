/**
 * Created by edel.ma on 7/10/17.
 */

const font = require('./font');

const fs = require('fs');

const dirList = ['./static/data/'];

exports.init = (cb) => {
    font.init(cb);

    dirList.forEach(url => {
        try {
            fs.statSync(url)
        }
        catch (e) {
            fs.mkdirSync(url)
        }
    });


    this.conf = JSON.parse(fs.readFileSync('./server/conf.json', "utf-8"));

    cb();
};

exports.conf = this.conf;