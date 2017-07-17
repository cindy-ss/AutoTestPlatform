/**
 * Created by edel.ma on 7/17/17.
 */

const query = require('../service/query'),
    url = require('url'),
    path = require('path'),
    file = require('../service/file'),
    async = require('async');

const BASE = ['_medium', '_medium_2x', '_large', '_large_2x'];

const check = (src, cb) => {
    if (!(cb && typeof cb === "function")) {
        cb = () => {
        };
    }

    const _url = url.resolve("https://www.apple.com/", src);

    const obj = path.parse(_url);

    const arr = obj.name ? obj.name.split("_") : [];

    let imageArr = [], resArr = [];

    let newName;

    if (arr.length >= 1) {
        if (arr[arr.length - 1] === "2x") {
            arr.pop();
            arr.pop();
        } else {
            arr.pop();
        }
        newName = arr.join('_');
    }

    if (newName) {
        for (let i of BASE) {
            imageArr.push(url.resolve(_url, `${newName}${i}${obj.ext}`));
        }
    }

    async.each(imageArr, (item, callback) => {
        file.getImageSizeByUrl(item, (err, obj) => {
            const temp = {
                url: item,
                res: obj
            };
            resArr.push(temp);
            callback(err);
        });
    }, (err) => {
        cb(err, resArr);
    });
};

exports.check = check;