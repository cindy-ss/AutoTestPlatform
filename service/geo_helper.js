/**
 * Created by edel.ma on 7/21/17.
 */

const GEO = ['/cn/', '/hk/en/', '/hk/', '/mo/', '/tw/'];

const GEO_PROP = ['cn', 'hktc', 'hken', 'mo', 'tw'];

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

const getGEO = str => {
    let res = 'US';
    for(let item of GEO_PROP){
        if(str.indexOf(GEO_OBJ[item]) !== -1){
            res = item.toUpperCase();
            break;
        }
    }
    return res;
};

const us2geoByUrl = (str, geo) => {
    let res = [];
    if(geo && geo !== 'gc'){
        let obj = {
            geo : geo,
            prefix : GEO_OBJ[geo],
            url : str.replace('apple.com/', `apple.com${GEO_OBJ[geo]}`)
        };
        res.push(obj);
    }else{
        for(let item of GEO_PROP){
            let obj = {
                geo : item,
                prefix : GEO_OBJ[item],
                url : str.replace('apple.com/', `apple.com${GEO_OBJ[item]}`)
            };
            res.push(obj);
        }
    }
    return res;
};

exports.us2geoByUrl = us2geoByUrl;
exports.us2geo = us2geo;
exports.geo2us = geo2us;
exports.isGEO = isGEO;
exports.getGEO = getGEO;