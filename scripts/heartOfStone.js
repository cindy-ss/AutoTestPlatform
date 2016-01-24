/**
 * Created by Edel on 15/12/8.
 */

var totalCards = 29;//1-30
var limitCards = 4;//1-5
var res = 0;
var times = 10000;
var deck = [];
var newDeck = [];

var clearDeck = function(){
    deck = [];
    for(var j = 0; j <= totalCards; j++){
        deck.push(j);
    }
    newDeck = [];
};

var judge = function(){
    var res = false;
    clearDeck();
    for(var j = 0; j < 3; j ++) {
        var k = Math.floor(Math.random() * deck.length);
        if (deck.splice(k, 1)[0] <= limitCards) {
            res = true;
            break;
        }
    }
    return res;
};

var lab = function(){
    res = 0;
    for(var i = 0; i < times; i ++){
        var flag = judge();
        if(!flag){
            flag = judge();
        }
        if(flag) res ++;
    }
    //console.log(res , times, res/times);
    return res/times;
};

var temp = 0;
for(var i = 0; i < times; i ++){
    temp += lab()
}
console.log(temp/times);
