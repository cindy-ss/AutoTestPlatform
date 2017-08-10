/**
 * Created by edel.ma on 7/24/17.
 */

const async = require('async');

const q = require('./query'),
    adapter = require('./adapter');

const getImagesByURL = (url, auth, cb, filter) => {
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
                                        console.log(`[ X ] : We encountered an error while dealing with ${item.url}`);
                                        callback(null, memo);
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
                }, filter);
            } else {
                cb(err, []);
            }
        }, auth);
    } else {
        cb(new Error('No valid url provided'), []);
    }
};

exports.getImagesByURL = getImagesByURL;