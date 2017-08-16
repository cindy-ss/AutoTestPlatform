/**
 * Created by edel.ma on 8/1/17.
 */

const fs = require("fs"),
    path = require("path"),
    URL = require("url");

const filter = (str, arr) => {
    let flag = true;

    flag = arr.reduce((memo, item) => {
        return memo && str.indexOf(item) === -1;
    }, flag);

    return flag;
};

const filterVersa = (str, arr) => {
    let flag = true;

    flag = arr.reduce((memo, item) => {
        return memo && item.indexOf(str) === -1;
    }, flag);

    return flag;
};

const deleteFolder = path => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(file => {
            const curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const urlNormalize = url => {
    if (!path.parse(url).ext) {
        if (url.charAt(url.length - 1) !== "/") {
            url += '/';
        }
    }

    if (!URL.parse(url).protocol) {
        url = 'https://' + url;
    }

    return url;
};

exports.filter = filter;
exports.filterVersa = filterVersa;
exports.deleteFolder = deleteFolder;
exports.urlNormalize = urlNormalize;