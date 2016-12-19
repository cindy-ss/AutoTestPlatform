const getPixels = require('get-pixels');

//getPixels('/Users/Edel/H/img/0822/01.jpg', (err, pixels) => {
getPixels('./fuck.jpg', (err, pixels) => {
    if(err){
        console.log(err);
        return;
    }
    console.log(pixels.get(6, 6, 0));
    console.log(pixels.get(6, 6, 1));
    console.log(pixels.get(6, 6, 2));
    //console.log(pixels.dimension);
});