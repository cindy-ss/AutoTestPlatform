/**
 * Created by Edel on 16/1/27.
 */


var util = (function(){
    return {
        getParam : function(fun){
            var str = fun.toString();
            str = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
            var arr = str.split(",");
            for(var i = 0; i < arr.length; i ++){
                arr[i] = arr[i].trim();
            }
            arr.push(fun);
            return(arr);
        }
    }
}());