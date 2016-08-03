/**
 * Created by Edel on 16/1/27.
 */


var util = (function () {
    return {
        getParam: function (fun) {
            var str = fun.toString();
            str = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
            var arr = str.split(",");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim();
            }
            arr.push(fun);
            return (arr);
        }
    }
}());

Array.prototype.clone = function(){
    return this.slice(0);
};

Array.prototype.unique = function(){
    var result = [], hash = {};
    for (var i = 0, elem; (elem = this[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
};