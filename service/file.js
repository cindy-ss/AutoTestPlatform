/**
 * Created by edel.ma on 7/11/17.
 */

const query = require('./query'),
    sizeOf = require('image-size');

const getImageSizeByUrl = (url, cb) => {
    let obj = {};

    query.bareQuery(url, (err, data, res) => {
        if(!err){
            obj = sizeOf(res);
            console.log("size="+obj);
        }

        cb(err, obj);
    }, {encoding : null});
};

exports.getImageSizeByUrl = getImageSizeByUrl;