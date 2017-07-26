/**
 * Created by lily.shen on 7/26/17.
 */
const ic = require('../service/image-checker');
const src = 'https://www.apple.com/cn/';

ic.getImages(src, (err, data) => {
    if(err){
        console.log(err);
    }else{
        console.log(`The check result for ${src} is : `);

    }
});