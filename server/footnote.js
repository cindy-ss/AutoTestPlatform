/**
 * Created by edel.ma on 6/28/17.
 */

const adapter = require('../service/adapter'),
    async = require('async');

const query = require('../service/query'),
    util = require('../service/util'),
    report = require('../service/report'),
    fs = require('fs');

let MAX_THREAD = 20;

const deal = (url, auth, cb) => {
    url = util.urlNormalize(url);

    query.query(url, (err, res) => {
        let obj = {};
        if (!err) {
            let data = adapter.footNoteHandler(res);
            obj = {
                url,
                data,
            }
        } else {
            console.log(`\t[ X ] : Querying data from ${url} failed, with an error of ${err.message}`);
            obj = {
                url,
                data: {}
            };
        }
        cb(null, obj);
    }, auth);
};

const runTask = (urlStr, auth, cb) => {
    let urlArr = urlStr.split('\n');
    async.mapLimit(urlArr, MAX_THREAD, (item, callback) => {
        deal(item, auth, (err, data) => {
            if (err) {
                console.log(`\t[ X ] : Doing viewport check failed on ${item}`);
            }
            callback(null, data);
        })
    }, (err, res) => {
        cb(res);
    });
};



exports.runTask = runTask;
