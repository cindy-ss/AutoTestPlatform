/**
 * Created by edel.ma on 7/10/17.
 */

const request = require('request');
// const conf = require('../server/conf').conf;
const basic = require('./basic');

basic.init({
    // odUser : conf.odName,
    // odPass : conf.odPass
});

const getHeaders = (url) => {
    return {
        referer: url,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4"
    };
};

const getOptions = (headers) => {
    console.log(basic.odUser);
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

const query = (url, cb, opt) => {
    if (url.indexOf('.html') === -1) {
        if (url.charAt(url.length - 1) !== "/") {
            url += '/';
        }
    }

    let options = opt || {};

    if(url.indexOf('http://ic') !== -1 || url.indexOf('https://ic') !== -1){
        const headers = getHeaders(url);
        options = getOptions(headers);
    }

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
        }else{
            cb(err, null);
        }
    });
};

const bareQuery = (url, cb, opt) => {
    let options = opt || {};

    if(url.indexOf('http://ic') !== -1 || url.indexOf('https://ic') !== -1){
        const headers = getHeaders(url);
        options = getOptions(headers);
    }

    request(url, options, (err, data, res) => {
        cb(err, data, res);
    });
};

exports.query = query;
exports.bareQuery = bareQuery;