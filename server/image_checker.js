/**
 * Created by edel.ma on 7/17/17.
 */

const async = require('async');

const ic = require('../service/image-checker'),
    gh = require('../service/geo_helper');

const check = (url, auth, cb) => {
    const arr = [{
        geo : 'us',
        url : url
    }].concat(gh.us2geoByUrl(url));
    async.map(arr, (item, callback) => {
        ic.check(item.url, auth, (err, data) => {
            let obj = {
                geo : item.geo,
                url : item.url,
                total : 0,
                list : []
            };
            if(!err){
                obj.total = data.length;
                obj.list = data;
                callback(null, obj);
            }else{
                callback(null, obj);
            }
        })
    }, (err, result) => {
        cb(null, result);
    });
};

exports.check = check;