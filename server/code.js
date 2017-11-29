
const async = require('async');

const comp = require('../service/code');

let MAX_THREAD = 20;

const runTask = (urlStr, auth, cb) => {
    let urlArr = urlStr.split('\n');
    async.mapLimit(urlArr, MAX_THREAD, (item, callback) => {
        comp.compare(item, auth, callback)
    }, (err, res) => {
        cb(res);
    });
};
exports.runTask = runTask;