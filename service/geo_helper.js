/**
 * Created by edel.ma on 7/21/17.
 */

const GEO = ['/cn/', '/hk/en/', '/hk/', '/mo/', '/tw/'];

const GEO_PROP = ['cn', 'hktc', 'hken', 'tw', 'mo'];

const GEO_OBJ = {
    'cn' : '/cn/',
    'hk' : ['/hk/en/', '/hk/'],
    'hktc' : '/hk/',
    'hken' : '/hk/en/',
    'mo' : '/mo/',
    'tw' : '/tw/',
};

//replace US2GEO US2GC
const us2geo = (str, geoStr) => {
    let res;

    if(str.indexOf('/v/') !== -1){
        if (geoStr) {
            if(GEO_OBJ[geoStr.toLowerCase()]){
                res = str.replace('/v/', GEO_OBJ[geoStr.toLowerCase()]);
            }
        } else {
            res = [];
            GEO.forEach((item, index) => {
                res.push(str.replace('/v/', item));
            })
        }
    }

    return res;
};

//replace GEO2US
const geo2us = str => {
    let res;
    if(str.indexOf('/v/') === -1){
        for(let item of GEO){
            if(str.indexOf(item) !== -1){
                res = str.replace(item, '/v/');
                break;
            }
        }
    }

    return res;
};

const isGEO = (str) => {
    let flag = false;
    for(let item of GEO){
        flag = flag || str.indexOf(item) !== -1;
    }
    return flag;
};

const us2geoByUrl = (str) => {
    let res = [];
    for(let item of GEO_PROP){
        let obj = {
            geo : GEO_OBJ[item],
            url : str.replace('apple.com/', `apple.com${GEO_OBJ[item]}`)
        };
        res.push(obj);
    }
    return res;
};

exports.us2geoByUrl = us2geoByUrl;
exports.us2geo = us2geo;
exports.geo2us = geo2us;
exports.isGEO = isGEO;