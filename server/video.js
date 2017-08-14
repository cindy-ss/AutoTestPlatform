const adapter = require('../service/adapter'),
    q = require('../service/query'),
util = require("../service/util");

const URL = require('url');

const getVideo = (url, auth, cb) => {
    url = util.urlNormalize(url);
    q.query(url, (err, res) => {
        if(!err){
            adapter.mp4Handler(res, (err, data) => {
                let res = {
                    url,
                    total : data.length,
                    list : []
                };
                data.forEach(item => {
                    res.list.push(URL.resolve(url, item));
                });
                cb(err, res);
            });
        }else{
            cb(err, []);
        }
    }, auth, {});
};

exports.getVideo = getVideo;