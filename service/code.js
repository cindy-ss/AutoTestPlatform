
const query = require('../service/query'),
    URL = require('url'),
    async = require('async'),
    cheerio = require('cheerio');
var fs=require('fs');

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


    return [baseArr, targetArr];
};



let _getContent = (str) => {
    let $ = cheerio.load(str);

    //const codetext = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs,.section-buystrip-hero').html();
    //const codetext = $('.ac-gallery-slidecontainer gold-aluminum-pink-sand-sport-loop-42').prop('data-casing-name');
   // const codetext = $('#gold-aluminum-pink-sand-sport-loop-42').prop('data-casing-name');

    var divChild = $(".ac-gallery-slidecontainer").children('div');
   let arr=[];
   console.log(divChild.find(""));

    /*
     divChild.map(item=>{
     if(item.attr('data-casing-name')){
     console.log("now:");
     console.log(item.attr('data-casing-name'));
     }
     })
     console.log(arr);


    =====

     let textArr = codetext.split('\n');
    let arr=[];
    textArr.map(item => {
        let temp = item.replace(/\t/g, '');
        if (temp.length > 0 && temp.replace(/ /g, '').length > 0) {
            arr.push(temp);
        }
    });
     console.log(arr);
    */


};


exports.compare = compare;