/**
 * Created by edel.ma on 6/28/17.
 */

const request = require('request');
const cheerio = require('cheerio');
const conf = require('./conf').conf;

const fetchTrans = (url, cb) => {
    const headers = getHeaders(url);
    const options = getOptions(headers);
    request(url, options, (err, data, res) => {
        const $ = cheerio.load(res);
        let desc = $("meta[name='Description']").attr('content');

        let ogDesc = $("meta[property='og:description']").attr('content');

        let ogTitle = $("meta[property='og:title']").attr('content');

        let title = $("title").text();

        let obj = {
            desc,
            ogDesc,
            title,
            ogTitle
        };

        cb(err, obj);
    });
};

const getHeaders = (url) => {
    return {
        referer: url,
        "User-Agent": conf.pkg
    };
};

const getOptions = (headers) => {
    return {
        auth: {
            user : conf.odName,
            pass : conf.odPass
        },
        strictSSL: false,
        followRedirect: false,
        headers
    };
};

exports.fetchTrans = fetchTrans;