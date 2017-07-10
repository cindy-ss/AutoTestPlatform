/**
 * Created by edel.ma on 7/10/17.
 */

const request = require('request');
const conf = require('../server/conf').conf;
const basic = require('./basic');

basic.init({
    odUser : conf.odName,
    odPass : conf.odPass
});

const getHeaders = (url) => {
    return {
        referer: url,
        "User-Agent": conf.pkg
    };
};

const getOptions = (headers) => {
    return {
        auth: {
            user: basic.odUser,
            pass: basic.odPass
        },
        strictSSL: false,
        followRedirect: false,
        headers
    };
};

const query = (url, cb) => {
    if (url.indexOf('.html') === -1) {
        if (url.charAt(url.length - 1) !== "/") {
            url += '/';
        }
    }

    const headers = getHeaders(url);
    const options = getOptions(headers);
    request(url, options, (err, data, res) => {
        if (!err && data && data.statusCode === 200) {
            if(data){
                if(data.statusCode === 200){
                    cb(null, res);
                }else{
                    cb({
                        msg : `Status Code Err, return ${data.statusCode}!`
                    }, null);
                }
            }else{
                cb({
                    msg : 'Data is Null!'
                }, null);
            }
            cb(null, res);
        }else{
            cb(err, null);
        }
    });
};

exports.query = query;