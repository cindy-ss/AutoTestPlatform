var page = require('webpage').create();
//var url = "http://weibo.com/p/1005051644161863/album?from=page_100505&mod=TAB#place";
var url = "http://photo.weibo.com/1644161863/albums/detail/album_id/16196100?from=profile_wb&pos=18#!/mode/1/page/1";
//page.open('https://mm.taobao.com/search_tstar_model.htm?spm=719.1001036.1998606017.2.zNU7V7', function (status) { //打开页面
page.open(url, function (status) { //打开页面
//page.open('http://weibo.com/1644161863/DqNGbreko', function (status) { //打开页面
    if (status !== 'success') {
        console.log('FAIL to load the address');
    } else {
        console.log(page.evaluate(
            function () {
            return document.body.innerHTML
        }))

    }
    phantom.exit();
});

