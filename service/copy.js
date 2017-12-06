
const query = require('../service/query'),
    URL = require('url'),
    async = require('async'),
    cheerio = require('cheerio');

let compare = (url, auth, cb) => {
    let ogURLObj = URL.parse(url);
    ogURLObj['host'] = 'www.apple.com';
    let online_url = URL.format(ogURLObj);

    // console.log(`${online_url} VS ${url}:\n`);
    Array.prototype.remove = function(val) {
        let index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    let newurl=url.split('/');
    newurl.remove('cn');
    let usurl= newurl.join('/');
    async.parallel([
        callback => {
            query.query(online_url, callback, auth);
        },
        callback => {
            query.query(usurl, callback, auth);
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
        for (let i = 0; i < targetArr.length; i++) {
            if(baseArr.indexOf(targetArr[i])==-1){
                newArr.push(targetArr[i]);

            }else{
                sameArr.push(targetArr[i]);
            }
        }

        for (let j = 0; j < baseArr.length; j++) {
            if(targetArr.indexOf(baseArr[j])==-1){
                oldArr.push(baseArr[j]);
            }
        }
    return [sameArr, oldArr, newArr];
};



let _getContent = (str) => {
    let $ = cheerio.load(str);


    //let _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs,.section-buystrip-hero').text();yijingzhushide
    let _text;
    if($(".section-buystrip-hero")){
        if($(".section-buystrip-hero").parent().is(".main")){
            if($("main")){
            if($("main").parent().is("main")){
                 _text = $('#main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs').text();
            }else{
             _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs').text();}
            }
            else{
                 _text = $('#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs');
            }
        }else{
             _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs,.section-buystrip-hero').text();
             }
    }else{
         _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs').text();
    }
    let textArr = _text.split('\n'), arr = new Array();
    textArr.map(item => {
        let temp = item.replace(/\t/g, '');
        if (temp.length > 0 && temp.replace(/ /g, '').length > 0) {
            arr.push(temp);
        }
        });
    // biao pan
    let _text2 = $(".gallery-watch");
    let arr2=[];// data-animation
    let arr3=[];// data-animation-locale
    let arr4=[];// aria-label
    let arrPan =[] ;//biao pan shu xing
    _text2.each(function(i,elem){
        arr2[i] = $(this).attr("data-animation");
        arr3[i] = $(this).attr('data-animation-locale');
        arr4[i] = $(this).attr('aria-label');
        arrPan.push("data-animation:"+arr2[i]+" "+"data-animation-locale:"+arr3[i]+" "+"aria-label:"+arr4[i]);
    });
    arrPan.shift();
    //biao kuan
    let arr5=[];//data-casing-name
    let arr6=[];//data-band-name
    let arr7=[];//aria-label
    let arr16=[];//data-size
    let arr8=[];//data-sku-model
    let arr20=[];//data-string-size
    let arrKuan=[];//biao kuan shuxing
    let _text3 = $("div.gallery-band-visible,div#gallery-cases,div.gallery-content-pane");
    _text3.each(function(i,elem){
        arr7[i]= $(this).attr('aria-label');
        arr5[i]= $(this).attr('data-casing-name');
        arr6[i]= $(this).attr('data-band-name');
        arr8[i]= $(this).attr('data-sku-model');
        arr16[i]=$(this).attr('data-size');
        arr20[i]=$(this).attr('data-string-size');
        if(arr7.join(',').indexOf("表带")==-1){
            arrKuan.push('aria-label:'+arr7[i]+" "+"data-casing-name:"+arr5[i]+" "+"data-band-name:"+arr6[i]+" "+'data-size:'+arr16[i]+"mm"+'data-sku-model:'+arr8[i]);
        }else{
            arrKuan.push('aria-label:'+arr7[i]+" "+"data-casing-name:"+arr5[i]+" "+"data-band-name:"+arr6[i]+" "+'data-size:'+arr16[i]+"毫米"+'data-sku-model:'+arr8[i]);

        }
    });
    arrKuan.shift();
    arrKuan.shift();
   //biao dai
    let _text4=$(".gallery-band-container,#gallery-bands");
    let arr9=[];//data-size
    let arr10=[];//data-background
    let arr11=[];//data-band-available
    let arr12=[];//data-band-unavailable-copy
    let arr13=[];//data-hidden
    let arr14=[];//aria-label
    let arr15=[];//data-buy
    let arrDai=[];//biao dai shuxing
    _text4.each(function(i,elem){
        arr9[i]=$(this).attr("data-size");
        arr10[i]=$(this).attr("data-background");
        arr11[i]=$(this).attr("data-band-available");
        arr12[i]=$(this).attr("data-band-unavailable-copy");
        arr13[i]=$(this).attr("data-hidden");
        arr14[i]=$(this).attr("aria-label");
        arr15[i]=$(this).attr("data-buy");
        if(arr14.join(',').indexOf("表带")==-1){
            arrDai.push('aria-label:'+arr14[i]+" "+'data-size:'+arr9[i]+"mm"+" "+'data-background:'+arr10[i]+" "+'data-band-available:'+arr11[i]+" "+"data-band-unavailable-copy:"+arr12[i]+" "+"data-hidden:"+arr13[i]+" "+"data-buy:"+arr15[i]);
        }else{
            arrDai.push('aria-label:'+arr14[i]+" "+'data-size:'+arr9[i]+"毫米"+" "+'data-background:'+arr10[i]+" "+'data-band-available:'+arr11[i]+" "+"data-band-unavailable-copy:"+arr12[i]+" "+"data-hidden:"+arr13[i]+" "+"data-buy:"+arr15[i]);
        }
    });
    arrDai.shift();
arr[0]=arrKuan;
arr[1]=arrDai;
arr[2]=arrPan;



    return arr;

};

exports.compare = compare;