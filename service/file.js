/**
 * Created by edel.ma on 7/11/17.
 */

const query = require('./query'),
    sizeOf = require('image-size');

const getImageSizeByUrl = (url, cb, auth) => {
    let obj = {};

    query.bareQuery(url, (err, data, res) => {
        if(data && data.statusCode === 200){
            obj = sizeOf(res);
            // console.log("size="+obj);
        }

        cb(err, obj);
    }, auth, {encoding : null});
};

exports.getImageSizeByUrl = getImageSizeByUrl;