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

const src = 'httphhjhjcn/';


query.query(src, (err, data) => {
    if (!err) {
        // adapter.imageHandler(data, (err, res) => {
        //     if (!err) {
        //         console.log(res);
        //     }
        // });
        adapter.wechatHandler(data, (err, res) => {
            if (!err) {
                console.log(res);
            }
        });


        adapter.bgHandler(data, (err, res) => {});
    }
});