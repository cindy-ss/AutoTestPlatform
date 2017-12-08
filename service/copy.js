const query = require('../service/query'),
    URL = require('url'),
    async = require('async'),
    cheerio = require('cheerio');

let autoplay = () =>{
    let flag;
    let compare = (url, auth, cb) => {
        let ogURLObj = URL.parse(url);
        ogURLObj['host'] = 'www.apple.com';
        let online_url = URL.format(ogURLObj);
        let new_url=URL.parse(url).pathname;
        let us_url;
        if (new_url.indexOf('cn')!==-1) {
            online_url = url;
            us_url = url.replace('/cn','');

        } else {
            us_url = url;
          let  new_arr = new_url.split('/');
               new_arr.splice(0,1,'/cn');
               new_url = new_arr.join('/');
            online_url = URL.parse(url).protocol + "//" + URL.parse(url).host + new_url;
               url = online_url;
        }


        console.log(`${online_url} VS ${url} VS ${us_url}\n`);

        async.parallel([
            callback => {
                query.query(online_url, callback, auth);
            },
            callback => {
                query.query(us_url, callback, auth);
            },
            callback => {
                query.query(url, callback, auth);
            }

        ], function (err, res) {
            let arr = [[], [], []];

            if (!err && res[0] && res[1] && res[2]) {
                arr = _comp(_getContent(res[0]), _getContent(res[1]), _getContent(res[2]));
                // console.log(_getContent(res[0]));
                // console.log(_getContent(res[2]));
            } else {
                console.log(`\t[ X ] : Fetching shared images on ${url} failed, with an error of ${err.message}`);
                // console.log(`${online_url} missed:\n\t${arr[0].join('\n\t')}\n\n${url} added:\n\t${arr[1].join('\n\t')}`);
            }


            arr.unshift(url);
            // arr[1] = arr[2];
            cb(err, arr);
        });


    if (URL.parse(url).pathname.indexOf('interactive-gallery') === -1 ){
        flag = 0;
    } else {
        flag = 1;

    }
    };
    let _getContent = (str) => {
        let $ = cheerio.load(str);

        if (flag === 0) {
            // console.log('addd');
            //let _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs,.section-buystrip-hero').text();yijingzhushide
            let _text;
            if ($(".section-buystrip-hero")) {
                if ($(".section-buystrip-hero").parent().is(".main")) {
                    if ($("main")) {
                        if ($("main").parent().is("main")) {
                            _text = $('#main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs').text();
                        } else {
                            _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs').text();
                        }
                    }
                    else {
                        _text = $('#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs');
                    }
                } else {
                    _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs,.section-buystrip-hero').text();
                }
            } else {
                _text = $('main,#main,.main,section.ac-gf-sosumi,nav.ac-gf-breadcrumbs').text();
            }
            let textArr = _text.split('\n'), arr = [];
            textArr.map(item => {
                let temp = item.replace(/\t/g, '');
                if (temp.length > 0 && temp.replace(/ /g, '').length > 0) {
                    arr.push(temp);
                }
            });

            return arr;

        }else {

            // console.log('aaaaa');
            // 表盘
            let _text2 = $(".gallery-watch");
            let arr_pan = [];//表盘属性
            let pan_obj = {animation: [], animation_locale: [], aria_label: [], id: []};
            _text2.each(function (i, elem) {
                pan_obj.animation[i]        = $(this).attr("data-animation");
                pan_obj.animation_locale[i] = $(this).attr('data-animation-locale');
                pan_obj.aria_label[i]       = $(this).attr('aria-label');
                pan_obj.id[i]               = $(this).attr('id');
                arr_pan.push("data-animation:" + pan_obj.animation[i] + " " + "data-animation-locale:" + pan_obj.animation_locale[i] + " " + "aria-label:" + pan_obj.aria_label[i] + " " + 'id:' + pan_obj.id[i]);
            });
            arr_pan.shift();
            //表款
            let kua_obj = {
                casing_name: [],
                band_name: [],
                aria_label: [],
                data_size: [],
                sku_model: [],
                string_size: [],
                id: []
            };
            let arr_kua = [];//表款属性
            let _text3 = $("div.gallery-band-visible,div#gallery-cases,div.gallery-content-pane");
            _text3.each(function (i, elem) {
                kua_obj.aria_label[i]  = $(this).attr('aria-label');
                kua_obj.casing_name[i] = $(this).attr('data-casing-name');
                kua_obj.band_name[i]   = $(this).attr('data-band-name');
                kua_obj.sku_model[i]   = $(this).attr('data-sku-model');
                kua_obj.data_size[i]   = $(this).attr('data-size');
                kua_obj.string_size[i] = $(this).attr('data-string-size');
                kua_obj.id[i] = $(this).attr('id');
                if (kua_obj.aria_label.join(',').indexOf("表带") === -1) {
                    arr_kua.push('aria-label:' + kua_obj.aria_label[i] + " " + "data-casing-name:" + kua_obj.casing_name[i] + " " + "data-band-name:" + kua_obj.band_name[i] + " " + 'data-size:' + kua_obj.data_size[i] + "mm" + " " + 'data-sku-model:' + kua_obj.sku_model[i] + " " + 'id:' + kua_obj.id[i]);
                } else {
                    arr_kua.push('aria-label:' + kua_obj.aria_label[i] + " " + "data-casing-name:" + kua_obj.casing_name[i] + " " + "data-band-name:" + kua_obj.band_name[i] + " " + 'data-size:' + kua_obj.data_size[i] + "毫米" + " " + 'data-sku-model:' + kua_obj.sku_model[i] + " " + 'id:' + kua_obj.id[i]);
                }
            });
            arr_kua.shift();
            arr_kua.shift();
            //表带
            let _text4 = $(".gallery-band-container,#gallery-bands");
            let dai_obj = {
                data_size: [],
                data_background: [],
                band_available: [],
                band_unavailable: [],
                data_hidden: [],
                aria_label: [],
                data_buy: [],
                id: []
            };
            let arr_dai = [];//表带属性
            _text4.each(function (i, elem) {
                dai_obj.data_size[i]        = $(this).attr("data-size");
                dai_obj.data_background[i]  = $(this).attr("data-background");
                dai_obj.band_available[i]   = $(this).attr("data-band-available");
                dai_obj.band_unavailable[i] = $(this).attr("data-band-unavailable-copy");
                dai_obj.data_hidden[i]      = $(this).attr("data-hidden");
                dai_obj.aria_label[i]       = $(this).attr("aria-label");
                dai_obj.data_buy[i]         = $(this).attr("data-buy");
                dai_obj.id[i]               = $(this).attr('id');
                if (dai_obj.aria_label.join(',').indexOf("表带") === -1) {
                    arr_dai.push('aria-label:' + dai_obj.aria_label[i] + " " + 'data-size:' + dai_obj.data_size[i] + "mm" + " " + 'data-background:' + dai_obj.data_background[i] + " " + 'data-band-available:' + dai_obj.band_available[i] + " " + "data-band-unavailable-copy:" + dai_obj.band_unavailable[i] + " " + "data-hidden:" + dai_obj.data_hidden[i] + " " + "data-buy:" + dai_obj.data_buy[i] + " " + 'id:' + dai_obj.id[i]);
                } else {
                    arr_dai.push('aria-label:' + dai_obj.aria_label[i] + " " + 'data-size:' + dai_obj.data_size[i] + "毫米" + " " + 'data-background:' + dai_obj.data_background[i] + " " + 'data-band-available:' + dai_obj.band_available[i] + " " + "data-band-unavailable-copy:" + dai_obj.band_unavailable[i] + " " + "data-hidden:" + dai_obj.data_hidden[i] + " " + "data-buy:" + dai_obj.data_buy[i] + " " + 'id:' + dai_obj.id[i]);
                }
            });
            arr_dai.shift();
            let arr = [];
            arr[0] = arr_kua;
            arr[1] = arr_dai;
            arr[2] = arr_pan;
            return arr;
        }


    };
    let _comp = (baseArr, targetArr) => {
        let sameArr = [], oldArr = [], newArr = [];
        for (let i = 0; i < targetArr.length; i++) {
            if (baseArr.indexOf(targetArr[i]) === -1) {
                newArr.push(targetArr[i]);

            } else {
                sameArr.push(targetArr[i]);
            }
        }

        for (let j = 0; j < baseArr.length; j++) {
            if (targetArr.indexOf(baseArr[j]) === -1) {
                oldArr.push(baseArr[j]);
            }
        }

        return [sameArr, oldArr, newArr];
    };

    exports.compare = compare;


};
autoplay();
