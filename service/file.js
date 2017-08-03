/**
 * Created by edel.ma on 7/11/17.
 */

const query = require('./query'),
    sizeOf = require('image-size'),
    fs = require('fs');

const getImageSizeByUrl = (url, cb, auth) => {
    let obj = {};

    query.bareQuery(url, (err, data, res) => {
        if (data && data.statusCode === 200) {
            if (Buffer.isBuffer(res)) {
                obj = sizeOf(res);
                cb(err, obj);
            } else {
                query.pngQuery(url, (fileName) => {
                    obj = sizeOf(`./${fileName}`);

                    fs.unlinkSync(`./${fileName}`);

                    cb(err, obj);
                });
            }
        }


    }, auth, {encoding: null});
};

exports.getImageSizeByUrl = getImageSizeByUrl;