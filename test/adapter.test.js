/**
 * Created by edel.ma on 7/10/17.
 */

const query = require('../service/query'),
    adapter = require('../service/adapter'),
    url = require('url'),
    file = require('../service/file');

// query.query('https://www.apple.com/cn/iphone/photography-how-to/', (err, data) => {
//     if(!err){
//         adapter.mp4Handler(data, (err, res) => {
//             if(!err){
//                 console.log(res);
//             }
//         });
//     }
// });

const src = 'https://www.apple.com/cn/retail/business/';


query.query(src, (err, data) => {
    if (!err) {
        // adapter.imageHandler(data, (err, res) => {
        //     if (!err) {
        //         console.log(res);
        //     }
        // });
        //
        // adapter.wechatHandler(data, (err, res) => {
        //     if (!err && res) {
        //         let tempUrl = url.resolve(src, res);
        //         console.log(tempUrl);
        //
        //         file.getImageSizeByUrl(tempUrl, (err, obj) => {
        //             console.log(obj);
        //         })
        //     }
        // });

        adapter.bgHandler(data, (err, res) => {});
    }
});