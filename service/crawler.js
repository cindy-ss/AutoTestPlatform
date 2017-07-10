/**
 * Created by edel.ma on 7/6/17.
 */

const request = require("request"),
    iconv = require('iconv-lite'),
    cheerio = require('cheerio'),
    u = require('url'),
    path = require('path');

const RETRY_TIME = 5, TIMEOUT = 5000;

let _waiting = new Set(), _running = new Set(), _finish = new Set(), _error = new Set(), _retry = {};

let host = "",
    base = '',
    origin = '',
    opt = {
        depth: 3,
        type: [".jpg", ".png"],
        target: "./tmp/",
        thread : 5,
        encoding : 'utf-8',
        deal : function(url, data, cb){
            console.log(url);
            cb();
        }
    };

const crawl = function (url, option) {
    //copy option.
    for(const p in opt){
        opt[p] = option[p] || opt[p];
    }
    host = u.parse(url).host;
    //todo judge the #;
    base = path.parse(url).ext ? path.parse(url).dir : (url.endsWith('/') ? url : url + '/') ;
    origin = url;

    _waiting.add(url);

    runTask();
};

const runTask = function () {
    if (_running.size <= 0 && _waiting.size <= 0) {
        console.log(`完成任务数 : ${_finish.size}`);
        console.log(`错误任务数 : ${_error.size}`);
        console.log("任务完成!");
    } else {
        while(_running.size < opt.thread && _waiting.size > 0){
            const temp = [..._waiting][0];
            _waiting.delete(temp);
            _running.add(temp);
            quest(temp);
        }
    }
};

const errHandler = function (url) {
    console.log(url + "deal error");
    _retry[url] = _retry[url] || 0;
    _retry[url]++;
    _running.delete(url);
    if (_retry[url] >= RETRY_TIME) {
        _error.add(url);
    } else {
        _waiting.add(url);
    }
    runTask();
};

const isUnique = function (url) {
    //todo judge the #;
    return !(_waiting.has(url) || _running.has(url) || _error.has(url) || _finish.has(url));
};

const quest = function (url) {
    const option = {
        url: url,
        timeout: TIMEOUT
    };
    try{
        request(option)
            .on('error', function (err) {
                errHandler(url)
            })
            .pipe(iconv.decodeStream(opt.encoding))
            .collect(function (err, data) {
                if (err) {
                    errHandler(url);
                } else {
                    analyse(url, data);
                }
            })
    }
    catch (e){
        console.log(`${url} quest failed`);
        errHandler(url);
    }
};

const analyse = function (url, data) {
    const $ = cheerio.load(data);
    const arr = $("a");

    arr.each(function (i, item) {
        if (item.attribs && item.attribs.href) {
            let tempUrl = item.attribs.href;
            let flag = false;
            if(!tempUrl.startsWith('http')){
                if(!tempUrl.includes('javascript:')){
                    tempUrl = u.resolve(url, tempUrl);
                }
            }
            if (tempUrl.startsWith(base) && isUnique(tempUrl)) {
                flag = tempUrl.slice(base.length).split('/').length < opt.depth + 1;
            }
            if(flag){
                if(isUnique(tempUrl)){
                    _waiting.add(tempUrl);
                }
            }
        }
    });

    opt.deal(url, data, err => {
        console.log(`${url} -- 完成,剩余任务数:${_waiting.size}。`);

        _running.delete(url);
        _finish.add(url);
        runTask();
    });
};

exports.crawl = crawl;