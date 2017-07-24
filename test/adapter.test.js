/**
 * Created by edel.ma on 7/10/17.
 */

const query = require('../service/query'),
    adapter = require('../service/adapter'),
    url = require('url'),
    file = require('../service/file'),
    async = require('async');

// query.query('https://www.apple.com/cn/iphone/photography-how-to/', (err, data) => {
//     if(!err){
//         adapter.mp4Handler(data, (err, res) => {
//             if(!err){
//                 console.log(res);
//             }
//         });
//     }
// });

const src = 'https://www.apple.com/';


query.query(src, (err, data) => {
    if (!err) {
        adapter.cssHandler(data, (err, res) => {
            if (!err) {
                console.log(res);
                async.reduce(res, [], (memo, item, callback) => {
                    query.query(item.url, (err, content) => {
                        adapter.bgHandler(content, (err, arr) => {
                            callback(null, memo.concat(arr));
                        })
                    })
                }, (err, res) => {
                    if (!err) {
                        console.log(res);
                    }
                });
            }
        });
    }
});