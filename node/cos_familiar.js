var arr1 = [1, 2, 2, 1, 1, 1, 0];
var arr2 = [1, 2, 2, 1, 1, 2, 1];

var cos_familiar = function(arr1, arr2){
    var res = 0, temp = 0, temp1 = 0, temp2 = 0;
    if(arr1.length == arr2.length){
        for(var i = 0; i < arr1.length; i ++){
            temp += arr1[i] * arr2[i];
            temp1 += arr1[i] * arr1[i];
            temp2 += arr2[i] * arr2[i];
        }
        res = temp / (Math.sqrt(temp1) * Math.sqrt(temp2));
    }
    return res;
};

console.log(cos_familiar(arr1, arr2));