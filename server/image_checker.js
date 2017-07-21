/**
 * Created by edel.ma on 7/17/17.
 */

const query = require('../service/query'),
    url = require('url'),
    path = require('path'),
    file = require('../service/file'),
    async = require('async'),
    gh = require('../service/geo_helper');

const BASE = ['_medium', '_medium_2x', '_large', '_large_2x', '_small', '_small_2x'];

const checkWithSize = (src, cb) => {
    if (!(cb && typeof cb === "function")) {
        cb = () => {
        };
    }

    const _url = url.resolve("https://www.apple.com/", src);

    let isUS = _url.indexOf('/v/') !== -1;

    const obj = path.parse(_url);

    const arr = obj.name ? obj.name.split("_") : [];

    let geoImageArr = [], usImageArr = [];
    let res = {
        geo: [],
        us: [],
    };
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
            const item = url.resolve(_url, `${newName}${i}${obj.ext}`);
            if(isUS){
                usImageArr.push(item);
            }else{
                geoImageArr.push(item);
                usImageArr.push(gh.geo2us(item));
            }
        }
    }

    async.waterfall([
        callback => {
            async.each(geoImageArr, (item, callbackInner) => {
                file.getImageSizeByUrl(item, (err, obj) => {
                    const temp = {
                        url: item,
                        res: obj
                    };
                    res.geo.push(temp);
                    callbackInner(err);
                });
            }, (err) => {
                callback(err);
            });
        },
        callback => {
            async.each(usImageArr, (item, callbackInner) => {
                file.getImageSizeByUrl(item, (err, obj) => {
                    const temp = {
                        url: item,
                        res: obj
                    };
                    res.us.push(temp);
                    callbackInner(err);
                });
            }, (err) => {
                callback(err);
            });
        }
    ], (err, result) => {
        cb(err, res);
    });
};

exports.checkWithSize = checkWithSize;
// exports.check = check;