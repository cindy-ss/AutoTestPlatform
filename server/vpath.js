const adapter = require('../service/adapter'),
    q = require('../service/query'),
    util = require("../service/util"),
    async = require("async"),
    gh = require("../service/geo_helper"),
    path = require('path');

const getVPaths = (url, auth, cb) => {
    url = util.urlNormalize(url);
    q.query(url, (err, res) => {
        if (!err) {
            adapter.attachHandler(res, (err, data) => {
                // if (!err) {
                //     data.forEach(item => {
                //         // res.list.push(URL.resolve(url, item));
                //     });
                // }
                cb(err, data);
            });
        } else {
            cb(err, []);
        }
    }, auth, {});
};

const runMultiTasks = (arr, auth, cb) => {
    arr = arr.split('\n');
    let obj = {};
    async.map(arr, (item, callback) => {
        obj[item] = {
            origin: [],
            us: []
        };
        let usUrl = gh.geo2us(item, true);
        let count = 0;
        getVPaths(item, auth, (err, data) => {
            if (err) {
                console.log(`\t[ X ] : Doing v path check failed on ${item}`);
            } else {
                obj[item].origin = data;
            }
            count++;

            if (count >= 2) {
                callback(null, data);
            }
        });
        getVPaths(usUrl, auth, (err, data) => {
            if (err) {
                console.log(`\t[ X ] : Doing v path check failed on ${usUrl}`);
            } else {
                obj[item].us = data;
            }
            count++;

            if (count >= 2) {
                callback(null, data);
            }
        })
    }, (err, res) => {
        for (let item in obj) {
            if (obj.hasOwnProperty(item)) {
                obj[item] = dealData(obj[item]);
            }
        }

        cb(err, obj);
    });
};

const dealData = data => {
    if (!data) {
        return;
    }
    let {origin, us} = data;

    let origin_res = getVersion(origin), us_res = getVersion(us);

    let res = [], checked = [];

    for (let item in origin_res) {
        if (origin_res.hasOwnProperty(item)) {
            item = origin_res[item];
            let obj = {
                flag: false,
                origin: item['item'],
                us: null
            };
            if (us_res[item['mark']]) {
                obj['us'] = us_res[item['mark']]['item'];
                if (item['version'] === us_res[item['mark']]['version']) {
                    obj['flag'] = true;
                }
            }

            checked.push(item['mark']);

            res.push(obj);
        }
    }

    for (let item in us_res) {
        if (us_res.hasOwnProperty(item)) {
            item = us_res[item];
            if (checked.indexOf(item['mark']) === -1) {
                let obj = {
                    flag: false,
                    origin: null,
                    us: item['item']
                };

                res.push(obj);
            }
        }
    }

    return res;
};

const getVersion = arr => {
    // let res = {
    //     nobuilt: []
    // };

    let res = {};

    arr.forEach(item => {
        let arr = item.match(/v\/[\/\-\w]*\/built/g), temp, obj = {
            version: null,
            product: null,
            filename: null,
            item
        };

        let tempLink = item.match(/[\w\:\/\.\-]*\/v\/[\w\:\/\.\-]*/);
        if (tempLink && tempLink.length >= 1) {
            obj['filename'] = path.basename(tempLink[0]);
        }

        if (arr && arr.length === 1) {
            temp = arr[0].split('/');
            temp.pop();
            temp.shift();

            obj['version'] = temp.pop();
            obj['product'] = temp.join('/');
        }

        obj['mark'] = `${obj['product'] || ''}_${obj['filename']}`;

        res[obj['mark']] = obj;

        // if (obj['product']) {
        //     res[obj['product']] = res[obj['product']] || {};
        //
        //     res[obj['product']][obj['filename']] = obj;
        // } else {
        //     res['nobuilt'].push(obj);
        // }
    });

    return res;
};

exports.getVPaths = getVPaths;
exports.runMultiTasks = runMultiTasks;