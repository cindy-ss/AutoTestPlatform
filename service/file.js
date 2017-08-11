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
                console.log(`\t[ X ] : image - '${url}' - not a buffer, start downloading.`);
                query.pngQuery(url, (fileName) => {
                    obj = sizeOf(`./static/data/${fileName}`);

                    fs.unlinkSync(`./static/data/${fileName}`);

                    cb(err, obj);
                }, auth);
            }
        }else{
            console.log(`\t[ X ] : Fetching image - '${url}' - failed. code is ${data.statusCode || '000'}`);
            cb(err, obj);
        }


    }, auth, {encoding: null});
};

exports.getImageSizeByUrl = getImageSizeByUrl;