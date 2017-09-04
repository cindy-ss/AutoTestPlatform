const adapter = require('../service/adapter'),
    q = require('../service/query'),
    util = require("../service/util"),
    async = require("async"),
gh = require("../service/geo_helper");

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
            origin : [],
            us : []
        };
        let usUrl = gh.geo2us(item, true);
        let count = 0;
        getVPaths(item, auth, (err, data) => {
            if (err) {
                console.log(`\t[ X ] : Doing v path check failed on ${item}`);
            }else{
                obj[item].origin = data;
            }
            count ++;

            if(count >= 2){
                callback(null, data);
            }
        });
        getVPaths(usUrl, auth, (err, data) => {
            if (err) {
                console.log(`\t[ X ] : Doing v path check failed on ${usUrl}`);
            }else{
                obj[item].us = data;
            }
            count ++;

            if(count >= 2){
                callback(null, data);
            }
        })
    }, (err, res) => {
        cb(err, obj);
    });
};

exports.getVPaths = getVPaths;
exports.runMultiTasks = runMultiTasks;