var arr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0, 11];

var currentNo = 0;
var count = Math.ceil(arr.length / 2);
//console.log(count);

var i = 0;
while(i < 10){
    console.log(currentNo);

    var tempArr = arr.slice(currentNo * 2, Math.min((currentNo + 1)*2, arr.length));

    console.log(tempArr);
    currentNo = (currentNo + 1) % count;
    i++;
}

