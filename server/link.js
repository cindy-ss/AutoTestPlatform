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
    let jUrl = decodeURIComponent(tempUrl);// jie ma
    let newUrl= jUrl.split('{"tempUrl":"');
    let linkUrl=newUrl[1].split('",\"text\":"');
    let textc= linkUrl[1].split('"}');
     textc.pop();
     let textp = textc.join('');
    let texto= textp.split('\\t').join('').split('\\n').join('').split('/n').join('').split('/t').join('');
    let obj = {
        type: null,
        href: newUrl[0],
        status: null,
        message: null,
        rawLink: linkUrl[0],
        text: texto

    };

    let host = URL.parse(tempUrl).hostname;
    let originHost = URL.parse(origin).hostname;

    const conf = basic.conf['link-checker'] || {};
    const filter = conf['filter'] || [];
    const extFilter = conf['ext-filter'] || [];
    const deformity = conf['deformity'] || {};
    let deformityList = [];
    for(let d in deformity){
        if (deformity.hasOwnProperty(d)) {
            deformityList.push(d);
        }
    }
    let tempDeformity = deformityList.find(item => {return tempUrl.indexOf(item) !== -1});

    if(host !== originHost && host.indexOf('apple.com') === -1 && extFilter.indexOf(host) === -1){

        obj.type = 'external';
        obj.status = 'pass';

    }else if (!util.filter(tempUrl, filter)) {

        obj.type = 'blacklist';
        obj.status = 'pass';

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
            obj.status = 'pass';
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