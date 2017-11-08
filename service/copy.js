const query = require('../service/query'),
    URL = require('url'),
    async = require('async'),
    cheerio = require('cheerio');

let compare = (url, auth) => {
    let ogURLObj = URL.parse(url);
    ogURLObj['host'] = 'www.apple.com';
    let online_url = URL.format(ogURLObj);

    console.log(`${online_url} VS ${url}:\n`);

    async.parallel([
        callback => {
            query.query(online_url, callback, auth);
        },
        callback => {
            query.query(url, callback, auth);
        }
    ], function (err, res) {
        if (err && res[0] && res[1]) {
            console.log(`\t[ X ] : Fetching shared images on ${url} failed, with an error of ${err.message}`);
        }else{

            console.log(_comp(_getContent(res[0]), _getContent(res[1])));
        }
    });
};

let _comp = (baseArr, targetArr) => {
    let resArr = new Set();

    baseArr.forEach(item => {
        if(!targetArr.has(item)){
            resArr.add(item);
        }
    });

    return resArr;
};

let _getContent = (str) => {
    let $ = cheerio.load(str);

    let _text = $('html').text();

    let textArr = _text.split('\n'), arr = new Set();

    textArr.map(item => {
        let temp = item.replace(/\t/g, '');
        if(temp.length > 0 && temp.replace(/ /g, '').length > 0){
            arr.add(temp);
        }
    });

    return arr;
};

exports.compare = compare;