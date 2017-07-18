/**
 * Created by edel.ma on 7/17/17.
 */

const ic = require('../server/image_checker');

const src = 'https://images.apple.com/v/mac/home/w/images/home/imac_pro_large.jpg';

ic.check(src, (err, data) => {
    if(err){
        console.log(err);
    }else{
        console.log(`The check result for ${src} is : `);
        data.forEach((item, index) => {
            console.log(`[${index}]. < ${item.url} > : ${item.res.height} * ${item.res.width}`);
        })
    }
});