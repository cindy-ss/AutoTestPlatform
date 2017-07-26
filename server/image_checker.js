/**
 * Created by edel.ma on 7/17/17.
 */

const async = require('async');

const ic = require('../service/image-checker');

const check = (urlArr, auth, cb) => {
    if(urlArr && urlArr.length > 0){
        async.everyLimit(urlArr, 2, (item, callback) => {
            ic.check(item, auth, (err, data) => {
                if(!err){
                    callback()
                }else{
                    callback(err, {})
                }
            })
        }, (err, result) => {});
    }else{
        cb(new Error('URL Array should be a non-empty array.'), [])
    }
};

exports.check = check;