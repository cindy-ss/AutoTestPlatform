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


String.prototype.lrtrim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
const urlNormalize = url => {
    if (!path.parse(url).ext) {
        if (url.charAt(url.length - 1) !== "/") {
            if(url.charAt(url.length -1 === " ")){
                url = url.lrtrim();
            }
            url += '/';
        }
    }
    let tUrl = URL.parse(url).protocol;
    if (!tUrl){
        url = 'https://' + url;
    }else{
        let sUrl=url.split('/');
        if(sUrl[0]!=='https:'){
            sUrl[0] = "https:";
            url=sUrl.join('/');
        }
        if(sUrl[1]!==""){
            sUrl.splice(1,0,'');
            sUrl[0]= "https:";
            url = sUrl.join('/');
        }
    }


    return url;
};


const isArray = object => {
    return  object && typeof object==='object' &&
        typeof object.length==='number' &&
        typeof object.splice==='function' &&
        !(object.propertyIsEnumerable('length'));
};

const getVersionNumber = str => {
    let obj = str.match(/\d{7}/g);
    let arr = [];
    obj.forEach(item => {arr.push(parseInt(item))});
    return arr.sort().join(' ');
};

exports.filter = filter;
exports.filterVersa = filterVersa;
exports.deleteFolder = deleteFolder;
exports.urlNormalize = urlNormalize;
exports.isArray = isArray;
exports.getVersionNumber = getVersionNumber;