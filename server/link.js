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
Array.prototype.unique = function(){
    let res = [];
    let json = {};
    for(let i = 0; i < this.length; i++){
        if(!json[this[i]]){
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};
const judgeUrl = (origin, urlObj, geo) => {

    let tempUrl = URL.resolve(origin, urlObj.tempUrl);

    let objText = urlObj.text.replace(/\/t/g,'').replace(/\/n/g,'');
    let finalText= objText.split('\t').join('').split('\n').join('');

    let obj = {
        type: null,
        href: tempUrl,
        status: null,
        message: null,
        rawLink: tempUrl,
        text: finalText

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
            if(tempUrl.indexOf(regStr) !== -1 ){
                obj.status = 'pass';
            }else{
                obj.status = 'failed';
                obj.message = `No GEO String ,${regStr} Required for ${tempUrl}`;
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
            obj.message = `No GEO string , ${geo} Required for ${tempUrl}`;
        }

    }

    // if(obj.type !== 'normal'){
    //     console.log(obj);
    // }
    if(obj.type !== 'normal'){
        // if(obj.href.split('/').length < 4){
        //     obj.href = '';
            console.log(obj);
        // }
    }

    return obj;
};
exports.getLinks = getLinks;