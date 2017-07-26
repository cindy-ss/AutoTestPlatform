/**
 * Created by edel.ma on 7/17/17.
 */

const ic = require('../server/image_checker');

const src = '/cn/iphone-7/images/overview/software_hero_medium_2x.jpg';

ic.checkWithSize(src, (err, data) => {
    if(err){
        console.log(err);
    }else{
        console.log(`The check result for ${src} is : `);
        console.log("GEO:");
        data.geo.forEach((item, index) => {
            console.log(`[${index + 1}]. < ${item.url} > : ${item.res.height} * ${item.res.width}`);
        });
        console.log("US:");
        data.us.forEach((item, index) => {
            console.log(`[${index + 1}]. < ${item.url} > : ${item.res.height} * ${item.res.width}`);
        })
    }
});