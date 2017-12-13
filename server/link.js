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
const judgeUrl = (origin, url, geo) => {

    let tempUrl = URL.resolve(origin, url);
    let jUrl = decodeURIComponent(tempUrl);// jie ma

    let fenUrl = jUrl.split('/{');
    let rawLink = fenUrl[0];

    fenUrl[0] = '';
    let heUrl = fenUrl.join('{');
    let uObj = JSON.parse(heUrl);


    let fiUrl,finUrl,rawUrl,aUrl;

        if(uObj.tempUrl.indexOf('.com') !==-1 ||uObj.tempUrl.indexOf('www.') !==-1 ||uObj.tempUrl.indexOf('.gov') !==-1){
            if(!URL.parse(uObj.tempUrl).protocol){
                fiUrl = 'https://' + uObj.tempUrl;
            }else{
                fiUrl = util.urlNormalize(uObj.tempUrl);
            }
            finUrl = fiUrl.split('/').unique().join('/');
        }else{
            rawUrl = rawLink.split('/');

            if(uObj.tempUrl.indexOf('#') ===-1){
                rawUrl.pop();
                rawUrl.pop();
                aUrl = rawUrl.join('/');
                fiUrl = aUrl + uObj.tempUrl;
            }else{
                fiUrl = rawLink + "/" + uObj.tempUrl;
            }




        }

        finUrl = fiUrl.split('/').unique().join('/');



    let finalText= uObj.text.split('\t').join('').split('\n').join('');

    let obj = {
        type: null,
        href: finUrl,
        status: null,
        message: null,
        rawLink: rawLink,
        text: finalText

    };
    let host = URL.parse(fiUrl).hostname;
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
    let tempDeformity = deformityList.find(item => {return fiUrl.indexOf(item) !== -1});

    if(host !== originHost && host.indexOf('apple.com') === -1 && extFilter.indexOf(host) === -1){

        obj.type = 'external';
        obj.status = 'pass';

    }else if (!util.filter(fiUrl, filter)) {

        obj.type = 'blacklist';
        obj.status = 'pass';

    } else if (tempDeformity) {

        obj.type = 'deformity';
        if(deformity[tempDeformity][geo.toLowerCase()]){
            let regStr = deformity[tempDeformity][geo.toLowerCase()];
            if(fiUrl.indexOf(regStr) !== -1 ){
                obj.status = 'pass';
            }else{
                obj.status = 'failed';
                obj.message = `No GEO String ,${regStr} Required for ${finUrl}`;
            }
        }else{
            obj.status = 'pass';
        }

    } else {

        obj.type = 'normal';
        if (gh.isGEO(fiUrl, geo)) {
            obj.status = 'pass';
        } else {
            obj.status = 'failed';
            obj.message = `No GEO string , ${geo} Required for ${uObj.tempUrl}`;
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