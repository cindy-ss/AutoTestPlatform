/**
 * Created by edel.ma on 6/28/17.
 */

const request = require('request');
const cheerio = require('cheerio');
const conf = require('./conf').conf;
const async = require('async');

const fetchTrans = (url, cb) => {
    if(url.indexOf('.html') === -1){
        if(url.charAt(url.length - 1) !== "/"){
            url += '/';
        }
    }
    const headers = getHeaders(url);
    const options = getOptions(headers);
    request(url, options, (err, data, res) => {
        const $ = cheerio.load(res);
        let desc = $("meta[name='Description']").attr('content');

        let ogDesc = $("meta[property='og:description']").attr('content');

        let ogTitle = $("meta[property='og:title']").attr('content');

        let title = $("title").text();

        let obj = {
            url,
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

const runTask = (urlArr, cb) => {
    async.map(urlArr, fetchTrans, (err, res) => {
        console.log(res);
        cb(res);
    });
};

exports.runTask = runTask;