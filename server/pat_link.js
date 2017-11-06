const PatLinks = require("@marcom/qa-pat-links"),
    util = require('../service/util');

const testsToRun = ["anchor", "geo", "imageSrc", "status"];

const getLinks = (url, auth) => {
    url = util.urlNormalize(url);

    const patLinks = new PatLinks(url, testsToRun, auth);

    return patLinks.init().then(patLinks.run.bind(patLinks));
};

exports.getLinks = getLinks;