/**
 * Created by edel.ma on 7/10/17.
 */

let odUser, odPass;

//Init with your OD user name and password.
const init = (option) => {
    option = option || {};
    odUser = option.odUser || undefined;
    odPass = option.odPass || undefined;
};

exports.init = init;
exports.odUser = odUser;
exports.odPass = odPass;