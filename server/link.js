const adapter = require('../service/adapter'),
    q = require('../service/query'),
    util = require('../service/util'),
    basic = require('../service/basic'),
    gh = require('../service/geo_helper');

const URL = require("url");

const getLinks = (url, auth, cb) => {
    url = util.urlNormalize(url);
    const geo = gh.getGEO(url);
    q.query(url, (err, data) => {
        if (!err) {
            adapter.linkHandler(data, (err, arr) => {
                if (!err) {
                    let res = [];
                    arr.forEach(item => {
                        res.push(judgeUrl(url, item, geo))
                    });
                    cb(null, res);
                } else {
                    cb(err);
                }
            });
        } else {
            cb(err);
        }
    }, auth, {});
};

const judgeUrl = (origin, url, geo) => {
    let tempUrl = URL.resolve(origin, url);
    let obj = {
        type: null,
        href: tempUrl,
        status: null,
        message: null,
        rawLink: url
    };

    let host = URL.parse(tempUrl).hostname;

    const conf = basic.conf['link-checker'] || {};
    const filter = conf['filter'] || [];
    const filterRegs = conf['filterRegs'] || [];
    const deformity = conf['deformity'] || {};
    let deformityList = [];
    for(let d in deformity){
        if (deformity.hasOwnProperty(d)) {
            deformityList.push(d);
        }
    }
    const hostDiff = conf['hostDiff'] || [];
    let tempDeformity = deformityList.find(item => {return tempUrl.indexOf(item) !== -1});

    if(filter.indexOf(tempUrl) !== -1){

        obj.type = 'blacklist';
        obj.status = 'omit';

    }else if (!util.filter(tempUrl, filterRegs)) {

        obj.type = 'blacklist';
        obj.status = 'omit';

    } else if (tempDeformity) {

        obj.type = 'deformity';
        if(deformity[tempDeformity][geo.toLowerCase()]){
            let regStr = deformity[tempDeformity][geo.toLowerCase()];

            if(tempUrl.indexOf(regStr) !== -1){
                obj.status = 'pass';
            }else{
                obj.status = 'failed';
                obj.message = `No GEO String ,${regStr} Required for ${url}`;
            }
        }else{
            obj.status = 'omit';
        }

    } else if (!util.filter(host, hostDiff)) {

        obj.type = 'hostDiff';
        if (gh.isGEO(tempUrl, geo)) {
            obj.status = 'pass';
        } else {
            obj.status = 'failed';
            obj.message = `No GEO string ,${geo} Required for ${url}`;
        }

    } else {

        obj.type = 'normal';
        if (gh.isGEO(tempUrl, geo)) {
            obj.status = 'pass';
        } else {
            obj.status = 'failed';
            obj.message = `No GEO string , ${geo} Required for ${url}`;
        }

    }

    if(obj.type !== 'normal'){
        console.log(obj);
    }

    return obj;
};

exports.getLinks = getLinks;