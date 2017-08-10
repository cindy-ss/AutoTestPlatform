/**
 * Created by edel.ma on 8/1/17.
 */

const fs = require("fs");

const filter = (str, arr) => {
    let flag = true;

    flag = arr.reduce((memo, item) => {
        return memo && str.indexOf(item) === -1;
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

exports.filter = filter;
exports.deleteFolder = deleteFolder;