
const query = require('../service/query'),
    URL = require('url'),
    async = require('async'),
    cheerio = require('cheerio');

let compare = (url, auth, cb) => {
    let ogURLObj = URL.parse(url);
    ogURLObj['host'] = 'www.apple.com';
    let online_url = URL.format(ogURLObj);

    // console.log(`${online_url} VS ${url}:\n`);

    async.parallel([
        callback => {
            query.query(online_url, callback, auth);
        },
        callback => {
            query.query(url, callback, auth);
        }
    ], function (err, res) {
        let arr = [];

        // err = err ||

        if (err && res[0] && res[1]) {
            console.log(`\t[ X ] : Fetching shared images on ${url} failed, with an error of ${err.message}`);
        } else {
            arr = _comp(_getContent(res[0]), _getContent(res[1]));
            // console.log(`${online_url} missed:\n\t${arr[0].join('\n\t')}\n\n${url} added:\n\t${arr[1].join('\n\t')}`);
        }

        cb(err, arr);
    });
};

// let _comp = (baseArr, targetArr) => {
//     let oldArr = [], newArr = [];

//     baseArr.forEach(item => {
//         if (!targetArr.has(item)) {
//             oldArr.push(item);
//         }
//     });

//     targetArr.forEach(item => {
//         if (!baseArr.has(item)) {
//             newArr.push(item);
//         }
//     });

//     return [oldArr, newArr];
// };

let _comp = (baseArr, targetArr) => {
    let oldArr = [], newArr = [];

    baseArr.forEach(item => {
            oldArr.push(item);
    });

    targetArr.forEach(item => {
            newArr.push(item);
    });

    return [oldArr, newArr];
};

let _getContent = (str) => {
    let $ = cheerio.load(str);

    let _text = $('main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs').text();

    let textArr = _text.split('\n'), arr = new Set();

    textArr.map(item => {
        let temp = item.replace(/\t/g, '');
        if (temp.length > 0 && temp.replace(/ /g, '').length > 0) {
            arr.add(temp);
        }
    });

    return arr;
};

exports.compare = compare;