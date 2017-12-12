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
    let newUrl= jUrl.split('{"tempUrl":"');
    let mUrl = newUrl[0].split('/');
    mUrl.pop();
    mUrl.pop();
    let kUrl = mUrl.join('/');
    let linkUrl=newUrl[1].split('",\"text\":"');
    let textC= linkUrl[1].split('"}');
    let lUrl = linkUrl[0].split('/');
    lUrl.shift();
    lUrl.shift();
    let iUrl = lUrl.join('/');
    let finalUrl,wUrl,eUrl,finUrl;
    if(tempUrl.indexOf('interactive-gallery') ===-1){
        // console.log('aaaa');
        if(linkUrl[0].indexOf('.com') !==-1 ||linkUrl[0].indexOf('www.') !==-1 ||linkUrl[0].indexOf('.gov') !==-1){
            finalUrl = 'https://' + iUrl;
        }else{
            console.log('bbbb');
            wUrl = newUrl[0].split('/');
            console.log(wUrl);
            wUrl.unique();
            wUrl.pop();
            wUrl.pop();
            eUrl = wUrl.join('/');
            finalUrl = eUrl + '/' + iUrl;

        }
        finUrl = finalUrl.split('/').unique().join('/');
    }else{

        // console.log('cccc');
        let nUrl = tempUrl.split('/');
        nUrl.pop();
        nUrl.pop();
        let tUrl = nUrl.join('/');
        if (textC.join('')) {
            // console.log('aaaa');
            finalUrl = tUrl + linkUrl[0];
        } else {
            // console.log('bbbb');
            // let mUrl = newUrl[0].split('/');
            // let kUrl = mUrl.pop();
            finalUrl = kUrl;
        }
        finUrl = finalUrl.split('/').unique().join('/');
    }





    let nUrl = finalUrl.split('/').unique();
    let fUrl = nUrl.join('/');
    textC.pop();
    let textP = textC.join('');
    let textO= textP.split('\\t').join('').split('\\n').join('').split('/n').join('').split('/t').join('');

    let obj = {
        type: null,
        href: finUrl,
        status: null,
        message: null,
        rawLink: newUrl[0],
        text: textO

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
    let tempDeformity = deformityList.find(item => {return finUrl.indexOf(item) !== -1});

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
            // //>>>
            // if(tempUrl.indexOf('?') !==-1){
            //     obj.status = 'failed';
            //     obj.message = `No GEO String ,${regStr} Required for ${finUrl}`;
            // }
            // //<<<<
            if(tempUrl.indexOf(regStr) !== -1){
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
        if (gh.isGEO(tempUrl, geo)) {
            obj.status = 'pass';
        } else {
            obj.status = 'failed';
            obj.message = `No GEO string , ${geo} Required for ${linkUrl[0]}`;
        }

    }

    // if(obj.type !== 'normal'){
    //     console.log(obj);
    // }
    if(obj.type !== 'normal'){
        if(obj.href.split('/').length < 4){
            obj.href = '';
            console.log(obj);
        }
    }

    return obj;
};
exports.getLinks = getLinks;