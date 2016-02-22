/**
 * Created by Edel on 16/2/22.
 */
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var total = [],
    playerNum = 0,
    current = 0,
    isOver = false,
    players = [],
    turns = 0;

var createPlayer = function(){
    var obj = {
        deck : [],
        cardArr : [],
        seat : 0
    };

    //playCard
    obj.sendCard = function(seatNo){};

    obj.react = function(){};

    return obj;
};

var start = function(){
    rl.question("How many players are there?", function(num){
        playerNum = num;
        total = sortCards();
        players = initPlayer(playerNum);
        rl.close();
    });
    while(!isOver){}
};

var sortCards = function(){
    var temp = {};
    var tempNum;
    var flag = true;
    var res = [];
    for(var i = 0; i < 64; i ++){
        while(flag){
            tempNum = Math.ceil(Math.random() * 8);
            temp[tempNum] = temp[tempNum] ? temp[tempNum] : 0;
            flag = temp[tempNum] >= 8;
        }
        flag = true;
        temp[tempNum] ++;
        res.push(tempNum);
    }
    return res;
};

var initPlayer = function(num){
    var temp;
    var av = total.length / num;
    var res = [];
    console.log(av);
    for(var i = 0; i < num; i ++){
        temp = createPlayer();
        temp.seat = i + 1;
        temp.deck = total.slice(i * av, (i + 1) * av -1).sort();
        res.push(temp);
    }
    console.log(res);
};

start();