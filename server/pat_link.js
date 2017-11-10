const PatLinks = require("@marcom/qa-pat-links"),
    util = require('../service/util');

const testsToRun = ["anchor", "geo", "imageSrc", "status"];

const getLinks = (url, auth) => {
    let urlArr = url.split('\n');
    let arr = [];

    urlArr.map(item => {
        arr.push(util.urlNormalize(item));
    });
    // url = util.urlNormalize(url);

    const patLinks = new PatLinks(arr, testsToRun, auth);

    return patLinks.init().then(patLinks.run.bind(patLinks));
};

exports.getLinks = getLinks;