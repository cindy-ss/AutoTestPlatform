/**
 * Created by edel.ma on 7/10/17.
 */

let odUser, odPass;

//Init with your OD user name and password.
const init = (option) => {
    option = option || {};
    this.odUser = option.odUser || undefined;
    this.odPass = option.odPass || undefined;
};

exports.init = init;
exports.odUser = this.odUser;
exports.odPass = this.odPass;