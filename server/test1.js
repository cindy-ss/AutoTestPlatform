/**
 * Created by lily.shen on 10/30/17.
 */

function loadPage(url) {
    var http = require('http');
    var pm = new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            var html = '';
            res.on('data', function (d) {
                html += d.toString()
            });
            res.on('end', function () {
                resolve(html);
            });
        }).on('error', function (e) {
            reject(e)
        });
    });
    return pm;
}
loadPage('http://www.baidu.com').then(function (d) {
    console.log(d);
});
