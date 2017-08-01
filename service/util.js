/**
 * Created by edel.ma on 8/1/17.
 */

const filter = (str, arr) => {
    let flag = true;

    flag = arr.reduce((memo, item) => {
        return memo && str.indexOf(item) === -1;
    }, flag);

    return flag;
};

exports.filter = filter;