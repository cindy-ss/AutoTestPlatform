/**
 * Created by edel.ma on 7/24/17.
 */

const findCssLinks = require("@marcom/find-css-links"),
    findInlineImages = require("@marcom/find-inline-images"),
    backgroundImages = require("@marcom/find-background-images");

const getImages = (src, cb) => {
    let cssArr = findCssLinks(src);
    let innerImageArr = findInlineImages(src);

    console.log(cssArr, innerImageArr);
    // let bgImageArr = backgroundImages(css);
};

//     console.log(link.url);
//     console.log(link.line);
//     console.log(image.url);
//     console.log(image.line);
//
// var css = fs.readFileSync("somecssfile.css").toString();
// var images = backgroundImages(css);
//     console.log(image.url);
//     console.log(image.meta.line);

exports.getImages = getImages;