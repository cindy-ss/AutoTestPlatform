/**
 * Created by edel.ma on 7/10/17.
 */

const request = require('request'),
    path = require('path');

const getHeaders = (url) => {
    return {
        referer: url,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4"
    };
};

const getOptions = (headers, auth) => {
    auth = auth || {
            odUser: '',
            odPass: ''
        };
    return {
        auth: {
            user: auth.odUser,
            pass: auth.odPass
        },
        strictSSL: false,
        followRedirect: false,
        headers
    };
};

//todo argument sort.
const query = (url, cb, auth, opt) => {
    if (! path.parse(url).ext) {
        if (url.charAt(url.length - 1) !== "/") {
            url += '/';
        }
    }

    let options = opt || {};

    if (url.indexOf('http://ic') !== -1 || url.indexOf('https://ic') !== -1) {
        const headers = getHeaders(url);
        options = getOptions(headers, auth);
    }

    request(url, options, (err, data, res) => {
        if (!err && data && data.statusCode === 200) {
            if (data) {
                if (data.statusCode === 200) {
                    cb(null, res);
                } else {
                    cb({
                        msg: `Status Code Err, return ${data.statusCode}!`
                    }, null);
                }
            } else {
                cb({
                    msg: 'Data is Null!'
                }, null);
            }
        } else {
            cb(err, null);
        }
    });
};

const bareQuery = (url, cb, auth, opt) => {
    let options = opt || {};

    if (url.indexOf('http://ic') !== -1 || url.indexOf('https://ic') !== -1) {
        const headers = getHeaders(url);
        options = getOptions(headers, auth);
    }

    request(url, options, (err, data, res) => {
        cb(err, data, res);
    });
};

exports.query = query;
exports.bareQuery = bareQuery;