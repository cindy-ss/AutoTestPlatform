/**
 * Created by edel.ma on 7/10/17.
 */

const request = require('request'),
    path = require('path'),
    fs = require('fs'),
    URL = require('url');

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
    if (!path.parse(url).ext) {
        if (url.charAt(url.length - 1) !== "/") {
            url += '/';
        }
    }

    if(!URL.parse(url).protocol){
        url = 'https://' + url;
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

const pngQuery = (url, cb, auth, opt) => {
    let options = opt || {};

    if (url.indexOf('http://ic') !== -1 || url.indexOf('https://ic') !== -1) {
        const headers = getHeaders(url);
        options = getOptions(headers, auth);
    }

    let pureUrl = URL.parse(url);
    pureUrl.search = '';
    pureUrl.hash = '';
    pureUrl = URL.format(pureUrl);
    const fileName = new Date().getTime() + path.extname(pureUrl);
    request(url, options).pipe(fs.createWriteStream(`./static/data/${fileName}`)).on('close', data => {
        cb(fileName);
    });
};

const downQuery = (url, target, cb, auth) => {
    let options = {encoding: null};

    if (url.indexOf('http://ic') !== -1 || url.indexOf('https://ic') !== -1) {
        const headers = getHeaders(url);
        options = getOptions(headers, auth);
    }

    try {
        fs.statSync(path.dirname(target))
    }
    catch (e) {
        fs.mkdirSync(path.dirname(target))
    }

    request(url, options).pipe(fs.createWriteStream(target)).on('close', data => {
        cb(null);
    }).on('error', err => {
        cb(err);
    });
};

exports.query = query;
exports.bareQuery = bareQuery;
exports.pngQuery = pngQuery;
exports.downQuery = downQuery;