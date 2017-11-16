// const PatLinks = require("@marcom/qa-pat-links"),
const    util = require('../service/util');

const testsToRun = [ "geo", "status"];

const getLinks = (url, auth) => {
    let urlArr = url.split('\n');
    let arr = [];

    urlArr.map(item => {
        arr.push(run(util.urlNormalize(item), auth));
    });

    // let a = new run;
    // a._runPatLinksTests(arr).then(finalResult => {
    //     if (finalResult.success.length === 0) {
    //         return this._displayHelpAndExit("\n\nNo Valid urls provided\n\n");
    //     }
    //     const oneUrl = Object.keys(finalResult.success[0])[1];
    //     const testClasses = _.uniq(finalResult.success[0][oneUrl].map(t => t._type));
    //     const reportData = this.reporter._createHTMLData(testClasses, finalResult);
    //
    //     console.log(reportData);
    // });

    return Promise.all(arr);
};

let run = (url, auth) => {
    const patLinks = new PatLinks(url, testsToRun, auth);

    return patLinks.init().then(patLinks.run.bind(patLinks));
};

exports.getLinks = (url, auth) => {
    return new Promise();
};