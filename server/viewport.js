/**
 * Created by edel.ma on 6/28/17.
 */

const cheerio = require('cheerio'),
    async = require('async');

const query = require('../service/query'),
    util = require('../service/util');

const fetchTrans = (url, auth, cb) => {
    url = util.urlNormalize(url);

    query.query(url, (err, res) => {
        if (!err) {
            let $, obj;
            try {
                $ = cheerio.load(res);
            }
            catch (e) {
                console.log(`\t[ X ] : Load response from ${url} failed, messages: ${e.message}`);
                $ = null;
            }

            if ($) {
                let viewport = $("meta[name='viewport']").attr('content');

                console.log(viewport);

                let obj = {
                    url,
                    flag : viewport === 'width=device-width, initial-scale=1, viewport-fit=cover',
                    viewport
                };

                cb(null, obj);
            } else {
                obj = {
                    url,
                    flag : false,
                    viewport : ''
                };
                cb(null, obj);
            }
        } else {
            console.log(`\t[ X ] : Querying data from ${url} failed, with an error of ${err.message}`);
            let obj = {
                url,
                flag : false,
                viewport: ''
            };
            cb(null, obj);
        }
    }, auth);
};

const runTask = (urlStr, auth, cb) => {
    let urlArr = urlStr.split('\n');
    async.map(urlArr, (item, callback) => {
        fetchTrans(item, auth, (err, data) => {
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