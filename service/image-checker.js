/**
 * Created by edel.ma on 7/24/17.
 */

const async = require('async');

const q = require('./query'),
    adapter = require('./adapter');

const check = (url, auth, cb) => {
    if (url) {
        q.query(url, (err, data) => {
            if (!err) {
                adapter.cssHandler(data, url, (err, res) => {
                    if (!err) {
                        async.reduce(res, [], (memo, item, callback) => {
                            q.query(item.url, (err, content) => {
                                adapter.bgHandler(content, item.url, (err, arr) => {
                                    if (!err) {
                                        callback(null, memo.concat(arr));
                                    } else {
                                        console.log(item.url);
                                        callback(err);
                                    }
                                })
                            }, auth)
                        }, (err, res) => {
                            if (!err) {
                                cb(null, res);
                            } else {
                                cb(err, []);
                            }
                        });
                    } else {
                        cb(err, []);
                    }
                });
            } else {
                cb(err, []);
            }
        }, auth);
    } else {
        cb(new Error('No valid url provided'), []);
    }
};

exports.check = check;