/**
 * Created by Edel on 2016/10/7.
 */

let start = 'WJ';
const end = 'WU';
let prev = 0;
let resArr = [start];

let calArr = [
    function(str: string):string{
        if(str.charAt(str.length - 1) == 'J'){
            str += 'U';
        }
        return str;
    }, function(str: string):string{
        let temp = str.substr(1);
        str = 'W' + temp + temp;
        return str;
    }, function(str: string):string{
        if(str.indexOf('JJJ') != -1){
            str.replace(/JJJ/g, 'U')
        }
        return str;
    }, function(str: string):string{
        if(str.indexOf('UU') != -1){
            str.replace(/UU/, '');
        }
        return str;
    }
];

let count = 0;
while(prev != resArr.length && count < 10000 && resArr.indexOf(end) == -1){
    let tempPrev = prev;
    prev = resArr.length;
    console.log(tempPrev, prev);
    for(let i = tempPrev; i < prev; i ++){
        for(let j = 0; j < 4; j ++){
            let temp = calArr[j](resArr[i]);
            if(resArr.indexOf(temp) == -1){
                resArr.push(temp);
            }
        }
    }
    console.log(resArr.length);
    count ++;
    if(resArr.indexOf(end) != -1){
        console.log('FUCK');
    }
}
console.log(count);
