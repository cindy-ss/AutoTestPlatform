/**
 * Created by edel.ma on 7/10/17.
 */

const font = require('./font');

const fs = require('fs');

const DIR_REQUIRED = ['./static/data/', './tmp/'],
    LEVEL = {
        'S': 2,
        'E': 1,
        'D': 3
    };//S for standard/summary; E for Error; D for Detail

const log_level = require('../server/config/server').config['log_level'];

exports.init = (cb) => {
    DIR_REQUIRED.forEach(url => {
        try {
            fs.statSync(url)
        }
        catch (e) {
            fs.mkdirSync(url)
        }
    });

    this.conf = JSON.parse(fs.readFileSync('./server/conf.json', "utf-8"));

    font.init(() => {
        cb();
    });
};

/**
 *
 * @param {Object}obj
 * @param {String}level
 * @constructor
 */
exports.log = function (obj, level) {
    if (!level || !LEVEL[level]) {
        level = 'S';
    }

    if(LEVEL[level] <= log_level){
        console.log(obj);
    }
};

exports.conf = this.conf;