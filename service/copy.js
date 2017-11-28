
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
        let arr = [[], [], []];


        if (!err && res[0] && res[1]) {
            arr = _comp(_getContent(res[0]), _getContent(res[1]));
        } else {
            console.log(`\t[ X ] : Fetching shared images on ${url} failed, with an error of ${err.message}`);
            // console.log(`${online_url} missed:\n\t${arr[0].join('\n\t')}\n\n${url} added:\n\t${arr[1].join('\n\t')}`);
        }

        arr.unshift(url);

        cb(err, arr);
    });
};

    let _comp = (baseArr, targetArr) => {
    let sameArr=[], oldArr = [], newArr = [];
    function aa(){
        for (var i = 0; i < targetArr.length; i++) {
            if(baseArr.indexOf(targetArr[i])==-1){
                newArr.push(targetArr[i]);
            }else{
                sameArr.push(targetArr[i]);
            }
        }
    }
    aa();

    function bb(){
        for (var i = 0; i < baseArr.length; i++) {
            if(targetArr.indexOf(baseArr[i])==-1){
                oldArr.push(baseArr[i]);
            }
        }
    } 
    bb();
    return [sameArr, oldArr, newArr];
};



let _getContent = (str) => {
    let $ = cheerio.load(str);

    let _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs,.section-buystrip-hero').text();

    let textArr = _text.split('\n'), arr = new Array();


    textArr.map(item => {
        let temp = item.replace(/\t/g, '');
        if (temp.length > 0 && temp.replace(/ /g, '').length > 0) {
            arr.push(temp);
        }
    });

    return arr;
};

exports.compare = compare;