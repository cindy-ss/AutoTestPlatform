const adapter = require('../service/adapter'),
    q = require('../service/query');

const getVideo = (url, auth, cb) => {
    q.query(url, (err, res) => {
        if(!err){
            adapter.videoHandler(res, (err, data) => {
                cb(err, data);
            });
        }else{
            cb(err, []);
        }
    }, auth, {});
};

exports.getVideo = getVideo;